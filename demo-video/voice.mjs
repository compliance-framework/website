// Voiceover helper for record.sh.
//
//   node voice.mjs clips <narration.json> <cache-dir> <out.json>
//       Turn each narration line into a WAV clip and write
//       {"<id>": {"file": "...", "ms": <duration>}} to out.json.
//       Clips are cached by engine, voice and text, so an unchanged line
//       is never generated (or paid for) twice.
//
//   node voice.mjs mix <video.webm> <run-result.txt> <clips.json> <out.mp4>
//       Read the narration start times the scene script returned, place
//       each clip at its time, and encode video plus voiceover to MP4.
//
// Settings (environment variables):
//   DEMO_TTS               openai | say | none   (default: openai when
//                          OPENAI_API_KEY is set, otherwise say)
//   OPENAI_API_KEY         needed for DEMO_TTS=openai
//   DEMO_TTS_MODEL         OpenAI speech model   (default gpt-4o-mini-tts)
//   DEMO_TTS_VOICE         OpenAI voice          (default fable)
//   DEMO_TTS_INSTRUCTIONS  how the OpenAI voice should speak
//   DEMO_SAY_VOICE         macOS say voice       (default Daniel)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const env = process.env;

export function engine() {
  const e = env.DEMO_TTS || (env.OPENAI_API_KEY ? 'openai' : 'say');
  if (!['openai', 'say', 'none'].includes(e)) die(`DEMO_TTS must be openai, say or none, not "${e}"`);
  if (e === 'openai' && !env.OPENAI_API_KEY) die('DEMO_TTS=openai needs OPENAI_API_KEY');
  return e;
}

function settings(e) {
  if (e === 'openai') {
    return {
      engine: e,
      model: env.DEMO_TTS_MODEL || 'gpt-4o-mini-tts',
      voice: env.DEMO_TTS_VOICE || 'fable',
      instructions: env.DEMO_TTS_INSTRUCTIONS ||
        'Calm, clear and friendly product-demo narration in British English, at a moderate pace.',
    };
  }
  return { engine: e, voice: env.DEMO_SAY_VOICE || 'Daniel' };
}

function die(msg) {
  console.error('error: ' + msg);
  process.exit(1);
}

function durationMs(file) {
  const out = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
    '-of', 'csv=p=0', file], { encoding: 'utf8' });
  return Math.round(parseFloat(out) * 1000);
}

// Re-encode to a clean 24 kHz mono WAV: OpenAI streams WAV with a
// placeholder length in the header, and say writes AIFF by default.
function toWav(src, dst) {
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-ar', '24000', '-ac', '1', dst]);
}

async function generate(s, text, file) {
  const raw = file + '.raw';
  if (s.engine === 'openai') {
    let res;
    for (let attempt = 1; ; attempt++) {
      res = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: s.model, voice: s.voice, input: text,
          instructions: s.instructions, response_format: 'wav' }),
      });
      if (res.ok || attempt >= 3 || (res.status < 500 && res.status !== 429)) break;
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
    if (!res.ok) die(`OpenAI speech request failed (${res.status}): ${await res.text()}`);
    fs.writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
  } else {
    execFileSync('say', ['-v', s.voice, '-o', raw + '.aiff', text]);
    fs.renameSync(raw + '.aiff', raw);
  }
  toWav(raw, file);
  fs.rmSync(raw);
}

async function clips(narrationFile, cacheDir, outFile) {
  const e = engine();
  if (e === 'none') { fs.writeFileSync(outFile, '{}'); return; }
  const s = settings(e);
  const lines = JSON.parse(fs.readFileSync(narrationFile, 'utf8'));
  const seen = new Set();
  for (const l of lines) {
    if (!l.id || !l.text) die(`every narration line needs an id and text: ${JSON.stringify(l)}`);
    if (seen.has(l.id)) die(`duplicate narration id "${l.id}"`);
    seen.add(l.id);
  }
  fs.mkdirSync(cacheDir, { recursive: true });
  const label = s.engine === 'openai' ? `OpenAI ${s.model}, voice ${s.voice}` : `macOS say, voice ${s.voice}`;

  const result = {};
  let made = 0;
  // A few requests at a time keeps well inside API rate limits.
  const queue = [...lines];
  const worker = async () => {
    for (let l = queue.shift(); l; l = queue.shift()) {
      const key = crypto.createHash('sha256').update(JSON.stringify([s, l.text])).digest('hex').slice(0, 24);
      const file = path.join(cacheDir, `${key}.wav`);
      if (!fs.existsSync(file)) { await generate(s, l.text, file); made++; }
      result[l.id] = { file, ms: durationMs(file) };
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  console.log(`Narration: ${lines.length} lines (${label}), ${made} generated, ${lines.length - made} cached`);
  fs.writeFileSync(outFile, JSON.stringify(result, null, 2));
}

// The run-code output has a "### Result" section holding the JSON the
// scene script returned.
function sceneResult(resultFile) {
  const text = fs.readFileSync(resultFile, 'utf8');
  const m = text.match(/^### Result\n([\s\S]*?)(?=\n### |\s*$)/m);
  if (!m) die(`no "### Result" section in ${resultFile}`);
  return JSON.parse(m[1]);
}

function mix(video, resultFile, clipsFile, outFile) {
  const { marks = [] } = sceneResult(resultFile);
  const clipMap = JSON.parse(fs.readFileSync(clipsFile, 'utf8'));
  const video_args = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart'];
  if (marks.length === 0) {
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', video, ...video_args, '-an', outFile], { stdio: 'inherit' });
    return;
  }
  const inputs = ['-i', video];
  const filters = [];
  marks.forEach((m, i) => {
    const clip = clipMap[m.id];
    if (!clip) die(`scene played narration "${m.id}" but there is no clip for it`);
    inputs.push('-i', clip.file);
    const at = Math.max(0, Math.round(m.at));
    filters.push(`[${i + 1}:a]adelay=${at}:all=1[n${i}]`);
  });
  // The clips never overlap (the scene waits for each to finish), so mix
  // without level normalisation, then pad with silence to the video's length.
  filters.push(`${marks.map((_, i) => `[n${i}]`).join('')}amix=inputs=${marks.length}:normalize=0:dropout_transition=0,apad[voice]`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex', filters.join(';'),
    '-map', '0:v', '-map', '[voice]', ...video_args, '-c:a', 'aac', '-b:a', '160k', '-shortest', outFile],
    { stdio: 'inherit' });
}

const [cmd, ...args] = process.argv.slice(2);
if (cmd === 'clips' && args.length === 3) await clips(...args);
else if (cmd === 'mix' && args.length === 4) mix(...args);
else die('usage: voice.mjs clips <narration.json> <cache-dir> <out.json> | mix <video> <result.txt> <clips.json> <out.mp4>');
