#!/usr/bin/env bash

DOCKER_ORG_NAME=dbg
DOCKER_IMAGE_NAME=dave-ui
CIRCLE_SHA1=1.0.0

# Get current location and dave-ui root
WHEREAMI=`dirname "${0}"`
if [ -z "${DAVE_UI_ROOT}" ]; then
    export DAVE_UI_ROOT=`cd "${WHEREAMI}/../" && pwd`
fi

# Copy the DAVe binaries
cp -r ${DAVE_UI_ROOT}/dist ${DAVE_UI_ROOT}/dockerfile

# docker login -e="$DOCKER_EMAIL" -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker build -t ${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${CIRCLE_SHA1} ${DAVE_UI_ROOT}/dockerfile/
docker tag -f ${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${CIRCLE_SHA1} docker.io/${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${CIRCLE_SHA1}
#docker push ${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${CIRCLE_SHA1}
#docker tag -f ${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${CIRCLE_SHA1} docker.io/${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${CIRCLE_BRANCH}
#docker push ${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${CIRCLE_BRANCH}

# Clean-up
rm -rf ${DAVE_UI_ROOT}/dockerfile/dist