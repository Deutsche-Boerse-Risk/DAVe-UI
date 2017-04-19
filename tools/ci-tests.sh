#!/usr/bin/env bash

if [ "${CIRCLE_BRANCH}" == "demo" ]; then
    grunt testCircleCI
else
    grunt testCircleCIMinimal
fi