#!/usr/bin/env bash
# Capture the Features page screenshots from a running CCF showcase.
#
# Usage: demo-video/screenshots.sh
#
# Writes PNGs to src/.vuepress/public/img/features/, which FeaturesPage.vue
# uses. Takes DEMO_URL, DEMO_EMAIL and DEMO_PASSWORD like record.sh.
#
# Needs playwright-cli (@playwright/cli), Chrome and node. See README.md.
set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
url=${DEMO_URL:-http://localhost:8000}
url=${url%/}
email=${DEMO_EMAIL:-admin@example.com}
password=${DEMO_PASSWORD:-password}
out_dir=$(cd "$here/.." && pwd)/src/.vuepress/public/img/features
session=ccf-demo-screenshots

die() { echo "error: $*" >&2; exit 1; }
command -v playwright-cli >/dev/null 2>&1 || die "playwright-cli not found. Install it with: npm install -g @playwright/cli"
command -v node >/dev/null 2>&1 || die "node not found."
curl -fsS -o /dev/null "$url/" \
  || die "no CCF UI at $url. Start the showcase with 'make demo-up-showcase' in the local-dev repo."

mkdir -p "$out_dir"
work=$(mktemp -d "${TMPDIR:-/tmp}/ccf-demo-screenshots.XXXXXX")
cleanup() {
  (cd "$work" && playwright-cli -s="$session" close >/dev/null 2>&1) || true
  rm -rf "$work"
}
trap cleanup EXIT

DEMO_CONFIG_URL="$url" DEMO_CONFIG_EMAIL="$email" DEMO_CONFIG_PASSWORD="$password" \
DEMO_CONFIG_OUT="$out_dir" node -e '
  const fs = require("fs");
  const [src, dst] = process.argv.slice(1);
  const config = JSON.stringify({
    baseUrl: process.env.DEMO_CONFIG_URL,
    email: process.env.DEMO_CONFIG_EMAIL,
    password: process.env.DEMO_CONFIG_PASSWORD,
    outDir: process.env.DEMO_CONFIG_OUT,
  });
  const script = fs.readFileSync(src, "utf8");
  const placeholder = "const CONFIG = __CONFIG__;";
  if (!script.includes(placeholder)) throw new Error(placeholder + " missing from " + src);
  fs.writeFileSync(dst, script.replace(placeholder, "const CONFIG = " + config + ";"));
' "$here/screenshots.js" "$work/shots.js"

# playwright-cli writes logs to .playwright-cli/ in the current directory.
cd "$work"
playwright-cli -s="$session" close >/dev/null 2>&1 || true
playwright-cli -s="$session" open --browser=chrome "$url/auth/login" >/dev/null
playwright-cli -s="$session" resize 1440 900 >/dev/null

echo "Capturing screenshots from $url..."
result=$(playwright-cli -s="$session" run-code --filename=shots.js 2>&1) || true
if printf '%s\n' "$result" | grep -q '^### Error'; then
  printf '%s\n' "$result" | sed -n '/^### Error/,/^###/p' >&2
  die "capture failed"
fi
ls -1 "$out_dir"
echo "Done: $out_dir"
