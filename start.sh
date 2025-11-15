#!/usr/bin/env bash
set -euo pipefail

cd /app/studyappserver
npm run start &
SERVER_PID=$!

cd /app/studyapp
export REACT_APP_API_BASE_URL=http://localhost:3001
export HTTPS=true
export SSL_CRT_FILE=./localhost+1.pem
export SSL_KEY_FILE=./localhost+1-key.pem
export PORT=443
npm run start &
FRONT_PID=$!

wait -n "$SERVER_PID" "$FRONT_PID"
