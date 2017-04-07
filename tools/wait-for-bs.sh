#!/usr/bin/env bash

while [ true ]
 do
    grunt browserstack_status:full | grep -v browserstack_status | grep -v Done | grep -v Process | grep -v "No running"

    sessions=`grunt browserstack_status:short | grep -v browserstack_status | grep -v Done | grep -v Process | grep -v "No running"`

    shouldSleep="0"

    while read -r line; do
        if [ "$line" != "0" ]
         then
            shouldSleep="1"
            break
         fi
    done <<< "$sessions"

    if [ "$shouldSleep" == "1" ]
     then
        SLEEP_TIMEOUT=`shuf -i 30-150 -n 1`
        echo "Waiting another $SLEEP_TIMEOUT seconds for BrowserStack session..."
        sleep $SLEEP_TIMEOUT
     else
        break
     fi
 done