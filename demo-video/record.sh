#!/usr/bin/env bash
# Record the CCF Meridian showcase demo video against a running CCF UI.
#
# Usage: demo-video/record.sh
#
# Settings (environment variables):
#   DEMO_URL       CCF UI to record          (default http://localhost:8000)
#   DEMO_EMAIL     login email               (default admin@example.com)
#   DEMO_PASSWORD  login password            (default password)
#   DEMO_OUT_DIR   where the video goes      (default demo-video/out)
#   DEMO_KEEP_WEBM set to 1 to keep the raw .webm next to the .mp4
#   DEMO_TTS       voiceover engine: openai, say or none
#                  (default openai when OPENAI_API_KEY is set, otherwise say)
#   DEMO_TTS_MODEL, DEMO_TTS_VOICE, DEMO_TTS_INSTRUCTIONS, DEMO_SAY_VOICE:
#                  see voice.mjs
#
# The narration is in narration.json. Generated clips are cached in
# demo-video/.cache/, so an unchanged line is not generated again.
#
# Needs playwright-cli (@playwright/cli), Chrome, node 18+ and ffmpeg. See README.md.
set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
url=${DEMO_URL:-http://localhost:8000}
url=${url%/}
email=${DEMO_EMAIL:-admin@example.com}
password=${DEMO_PASSWORD:-password}
out_dir=${DEMO_OUT_DIR:-$here/out}
cache_dir=$here/.cache/narration
keep_webm=${DEMO_KEEP_WEBM:-0}
session=ccf-demo-video

die() { echo "error: $*" >&2; exit 1; }

need() {
  command -v "$1" >/dev/null 2>&1 || die "$1 not found. $2"
}

need playwright-cli "Install it with: npm install -g @playwright/cli"
need node "Install Node.js (playwright-cli needs it too)."
need ffmpeg "Install it with: brew install ffmpeg"

curl -fsS -o /dev/null "$url/" \
  || die "no CCF UI at $url. Start the showcase with 'make demo-up-showcase' in the local-dev repo."

mkdir -p "$out_dir"
out_dir=$(cd "$out_dir" && pwd)
webm="$out_dir/ccf-showcase-demo.webm"
mp4="$out_dir/ccf-showcase-demo.mp4"

work=$(mktemp -d "${TMPDIR:-/tmp}/ccf-demo-video.XXXXXX")
cleanup() {
  (cd "$work" && playwright-cli -s="$session" close >/dev/null 2>&1) || true
  rm -rf "$work"
}
trap cleanup EXIT

# Voiceover clips first: the scene needs their lengths to pace itself.
node "$here/voice.mjs" clips "$here/narration.json" "$cache_dir" "$work/clips.json"

# Fill in the CONFIG placeholder with JSON so any characters in the settings are safe.
DEMO_CONFIG_URL="$url" DEMO_CONFIG_EMAIL="$email" DEMO_CONFIG_PASSWORD="$password" \
DEMO_CONFIG_OUT="$webm" DEMO_CONFIG_CLIPS="$work/clips.json" node -e '
  const fs = require("fs");
  const [src, dst] = process.argv.slice(1);
  const clips = JSON.parse(fs.readFileSync(process.env.DEMO_CONFIG_CLIPS, "utf8"));
  const config = JSON.stringify({
    baseUrl: process.env.DEMO_CONFIG_URL,
    email: process.env.DEMO_CONFIG_EMAIL,
    password: process.env.DEMO_CONFIG_PASSWORD,
    out: process.env.DEMO_CONFIG_OUT,
    clips: Object.fromEntries(Object.entries(clips).map(([id, c]) => [id, c.ms])),
  });
  const script = fs.readFileSync(src, "utf8");
  const placeholder = "const CONFIG = __CONFIG__;";
  if (!script.includes(placeholder)) throw new Error(placeholder + " missing from " + src);
  fs.writeFileSync(dst, script.replace(placeholder, "const CONFIG = " + config + ";"));
' "$here/showcase-demo.js" "$work/scene.js"

# playwright-cli writes logs to .playwright-cli/ in the current directory,
# so run it from the temporary work directory.
cd "$work"

# A fresh browser each time: overlays left by an earlier, aborted run would
# otherwise show up in this recording.
playwright-cli -s="$session" close >/dev/null 2>&1 || true
rm -f "$webm"
echo "Opening Chrome on $url/auth/login"
playwright-cli -s="$session" open --browser=chrome "$url/auth/login" >/dev/null
playwright-cli -s="$session" resize 1440 900 >/dev/null

echo "Recording (about 4 minutes)..."
result=$(playwright-cli -s="$session" run-code --filename=scene.js 2>&1) || true
printf '%s\n' "$result" > "$work/result.txt"
if [ ! -s "$webm" ] || printf '%s\n' "$result" | grep -q '^### Error'; then
  printf '%s\n' "$result" | sed -n '/^### Error/,/^###/p' >&2
  if printf '%s\n' "$result" | grep -q 'ms-playwright/ffmpeg'; then
    echo "hint: Playwright needs its own ffmpeg; see 'Playwright's ffmpeg' in $here/README.md" >&2
  fi
  die "recording failed"
fi
# The scene returns {"out": ..., "skipped": [...], "marks": [...]};
# warn about any skipped steps.
summary=$(printf '%s\n' "$result" | sed -n '/^### Result/{n;p;}')
if ! printf '%s\n' "$summary" | grep -q '"skipped":\[\]'; then
  echo "warning: some optional steps were skipped: $summary" >&2
fi

echo "Encoding $mp4 with the voiceover"
node "$here/voice.mjs" mix "$webm" "$work/result.txt" "$work/clips.json" "$mp4"
[ "$keep_webm" = 1 ] || rm -f "$webm"

echo "Done: $mp4"
