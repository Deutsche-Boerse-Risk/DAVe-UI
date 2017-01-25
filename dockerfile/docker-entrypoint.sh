#!/bin/bash
set -ex

# if command starts with an option, prepend the start script
if [ "${1:0:1}" = '-' ]; then
  set -- nginx "$@"
fi

echo "$@"

if [ "$1" = "nginx" ]; then
  if [ "$DAVE_REST_URL" ]; then
    echo "window.baseRestURL = '${DAVE_REST_URL}/api/v1.0';" > /usr/share/nginx/html/restUrl.js
  fi
fi

exec "$@"
