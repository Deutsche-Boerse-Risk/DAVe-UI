#!/usr/bin/env bash

while [ "$(grunt browserstack_status | grep 'Running sessions' | awk '{print substr($0,length,1)}')" != "0" ]
 do
    echo "Waiting another 60 seconds for BrowserStack session..."
    sleep 60
 done