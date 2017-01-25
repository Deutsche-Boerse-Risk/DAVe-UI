#!/usr/bin/env bash

CIRCLE_SHA1=1_0

# Copy the DAVe binaries
cp -r -v ./dist ./dockerfile

# Delete the prefilled
# docker login -e="$DOCKER_EMAIL" -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker build -t wg379/dave-ui:${CIRCLE_SHA1} ./dockerfile/
#docker tag -f wg379/dave-ui:${CIRCLE_SHA1} docker.io/wg379/dave-ui:${CIRCLE_SHA1}
#docker push scholzj/dave:${CIRCLE_SHA1}
#docker tag -f scholzj/dave:${CIRCLE_SHA1} docker.io/scholzj/dave:${CIRCLE_BRANCH}
#docker push scholzj/dave:${CIRCLE_BRANCH}
