#!/usr/bin/env bash

while [ "$(curl -s -u $BROWSER_STACK_USERNAME:$BROWSER_STACK_ACCESS_KEY https://www.browserstack.com/automate/builds.json?status=running | jq '. | length')" != "0" ]
 do
    echo "Waiting another 60 seconds for BrowserStack session..."
    sleep 60
 done