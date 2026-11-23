# Showcase demo video

This folder holds the scripts that record a demo video of the Continuous Compliance
Framework UI. The video runs about 4 minutes and shows the Meridian Financial Group
showcase from the
[local-dev](https://github.com/compliance-framework/local-dev) repo, with title
cards, captions and a spoken voiceover. It is not part of the website build. Nothing under `demo-video/`
is published.

## What the video shows

1. A title card, then a login as the demo admin.
2. **Evidence:** the global evidence list, then a failing GitHub check with its
   status, signature and history.
3. **Systems:** choosing the Customer Portal SSP, then its Compliance page (one
   view per profile) and its Implementation page.
4. **Compliance Map:** a drill-down from Secure Delivery & Resilience Policy to
   Infrastructure Resilience, the Resilience controls, and "Production workloads
   span multiple availability zones" with its linked risks. Then the same control
   across all ten systems, and the Graph view.
5. **Risks:** the risk dashboard with its heatmap, then the risk register.
6. **Workflows:** the scheduled workflow instances, then the quarterly access
   review for the Workforce Identity Provider.
7. A closing card.

The script only reads. It never executes workflows, reassigns roles or changes
risks, so you can record it right before a live demo.

## Prerequisites

- The showcase running locally. In the local-dev repo, run `make demo-up-showcase`.
  The UI is then at http://localhost:8000. Start it an hour early if you can, so the
  compliance-over-time charts have some history.
- [`playwright-cli`](https://www.npmjs.com/package/@playwright/cli)
  (`npm install -g @playwright/cli`), Google Chrome, Node.js 18 or later and `ffmpeg`.
- For the OpenAI voice, an `OPENAI_API_KEY` in your environment. Without one, the
  voiceover falls back to the macOS `say` command (see [Voiceover](#voiceover)).

### Playwright's ffmpeg

Playwright writes the video with its own copy of ffmpeg. If you don't have it,
recording stops with `Executable doesn't exist at
~/Library/Caches/ms-playwright/ffmpeg-<n>/ffmpeg-mac`. You can fix this in one of
two ways:

```shell
npx playwright install ffmpeg            # download Playwright's build
# or point that path at an ffmpeg you already have (use <n> from the error):
mkdir -p ~/Library/Caches/ms-playwright/ffmpeg-<n>
ln -s "$(command -v ffmpeg)" ~/Library/Caches/ms-playwright/ffmpeg-<n>/ffmpeg-mac
```

## Record

```shell
make demo-video                 # or: demo-video/record.sh
```

The finished video is `demo-video/out/ccf-showcase-demo.mp4` (1440×900, H.264 with
AAC voiceover), and `out/` is gitignored. `record.sh` takes these settings as environment
variables:

| Variable         | Default                 | Meaning                              |
|------------------|-------------------------|--------------------------------------|
| `DEMO_URL`       | `http://localhost:8000` | CCF UI to record                     |
| `DEMO_EMAIL`     | `admin@example.com`     | Login email                          |
| `DEMO_PASSWORD`  | `password`              | Login password                       |
| `DEMO_OUT_DIR`   | `demo-video/out`        | Where the video goes                 |
| `DEMO_KEEP_WEBM` | `0`                     | Set to `1` to keep the raw `.webm`   |
| `DEMO_TTS`       | `openai` if `OPENAI_API_KEY` is set, else `say` | Voiceover engine: `openai`, `say` or `none` |
| `DEMO_TTS_MODEL` | `gpt-4o-mini-tts`       | OpenAI speech model                  |
| `DEMO_TTS_VOICE` | `fable`                 | OpenAI voice                         |
| `DEMO_TTS_INSTRUCTIONS` | calm British product-demo narration | How the OpenAI voice should speak |
| `DEMO_SAY_VOICE` | `Daniel`                | macOS `say` voice                    |

The defaults are the documented local-dev demo credentials, not real ones.

## Voiceover

The spoken lines are in `narration.json`, one per beat of the video, each with an
`id`. `record.sh` turns them into audio clips with `voice.mjs` before it records.
The scene script then holds each beat until its line has finished, so the picture
and voice can't drift apart however long a line is. Afterwards the clips are mixed
onto the video at the moments their beats started.

- **Engines.** `openai` sounds the most natural. It sends the narration text (and
  nothing else) to OpenAI's speech API, and a full set of lines costs a few cents.
  `say` is built into macOS, so it works offline and costs nothing, but it sounds
  robotic. `none` records a silent video, paced as before.
- **Caching.** Clips are cached in `demo-video/.cache/narration/` (gitignored),
  keyed by the engine settings and the text. Re-recording only generates lines that
  are new or changed, and the run prints how many it generated and how many came
  from the cache.
- **Changing a line.** Edit its `text` in `narration.json` and record again.
- **Adding a line.** Add it to `narration.json`, then play it from the scene with
  `const n = narrate('<id>'); …actions…; await n.done();`. A typo in an `id`
  stops the recording with an error instead of playing nothing.

## Changing the video

The scenes are in `showcase-demo.js`, a Playwright function run by
`playwright-cli run-code`. `record.sh` replaces its `__CONFIG__` placeholder with
the URL, the login and the output path. Inside the scene script:

- `chapter(title, description, id, ms)` shows a full-screen title card for at
  least `ms`, held for as long as its narration line `id` runs.
- `narrate(id)` starts a narration line; `await` its `done()` before moving on.
- `caption(text)` sets the caption bar along the bottom; `caption(null)` clears it.
- `nav(href, group)` clicks a sidebar link, opening its collapsed group first.
- `expand(name)` opens a node in the Compliance Map tree.
- `tryStep(fn)` wraps the nice-to-have steps. If one fails, the run keeps
  recording rather than stopping, and `record.sh` prints a warning naming the step.

The locators depend on the showcase seed data and on the UI's labels. If the UI
changes and a required step fails, `record.sh` prints the Playwright error. To find
the new locator, open a session with `playwright-cli open --browser=chrome
http://localhost:8000` and run `playwright-cli snapshot`.

To check a take without watching all of it, tile a frame every 5 seconds:

```shell
ffmpeg -i demo-video/out/ccf-showcase-demo.mp4 -vf "fps=1/5,scale=480:-1,tile=5x8" -frames:v 1 contact.png
```
