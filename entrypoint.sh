#!/bin/bash
set -euo pipefail

cd /app

touch .env || true
if [[ ! -z ${PROJECT_ID:-} && ! -z ${SECRET_ID:-} ]]; then
  node accessSecret.js projects/$PROJECT_ID/secrets/$SECRET_ID/versions/latest > .env
else
  >&2 echo "Warning: Not pulling .env from secrets"
fi
set -a
. .env
set +a

pnpm start
