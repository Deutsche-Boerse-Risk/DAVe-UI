#!/usr/bin/env bash

DOCKER_ORG_NAME=dbgdave
DOCKER_IMAGE_NAME=dave-ui

# Get current location and dave-ui root
WHEREAMI=`dirname "${0}"`
if [ -z "${DAVE_UI_ROOT}" ]; then
    export DAVE_UI_ROOT=`cd "${WHEREAMI}/../" && pwd`
fi
# Get the dist package
if [ -z "${DAVE_UI_DIST}" ]; then
    export DAVE_UI_DIST=`cd "${DAVE_UI_ROOT}/dist" && pwd`
fi

# Copy the DAVe binaries
cp -r ${DAVE_UI_DIST} ${DAVE_UI_ROOT}/dockerfile

docker login -e="$DOCKER_EMAIL" -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker build -t ${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${CIRCLE_SHA1} ${DAVE_UI_ROOT}/dockerfile/
docker tag -f ${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${CIRCLE_SHA1} docker.io/${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${CIRCLE_SHA1}
docker push ${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${CIRCLE_SHA1}
docker tag -f ${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${CIRCLE_SHA1} docker.io/${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${CIRCLE_BRANCH}
docker push ${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${CIRCLE_BRANCH}

# Clean-up
rm -rf ${DAVE_UI_ROOT}/dockerfile/dist
