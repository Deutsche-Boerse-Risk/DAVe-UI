#!/usr/bin/env bash

while [ "$(grunt browserstack_status | grep 'Running sessions' | awk '{print substr($0,length,1)}')" != "0" ]
 do
    SLEEP_TIMEOUT=`shuf -i 30-150 -n 1`
    echo "Waiting another $SLEEP_TIMEOUT seconds for BrowserStack session..."
    sleep $SLEEP_TIMEOUT
 done