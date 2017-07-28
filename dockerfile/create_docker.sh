#!/bin/sh -xe

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

# If you don't have sha1 provided by Jenkins/CircleCI
if [ -n "${CIRCLE_SHA1}" ]; then
    export GIT_SHA1=${CIRCLE_SHA1}
fi
if [ -z "${GIT_SHA1}" ]; then
    export GIT_SHA1=`git rev-parse HEAD`
fi

# If you don't have branch provided by Jenkins/CircleCI
if [ -n "${CIRCLE_BRANCH}" ]; then
    export GIT_BRANCH=${CIRCLE_BRANCH}
fi
if [ -z "${GIT_BRANCH}" ]; then
    export GIT_BRANCH=`git symbolic-ref --short HEAD`
fi

# Set defualt docker hub
if [ -z "${DOCKER_HUB}" ]; then
    export DOCKER_HUB=docker.io
fi

# Copy the DAVe binaries
cp -r ${DAVE_UI_DIST} ${DAVE_UI_ROOT}/dockerfile

# Build the image
docker build -t ${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${GIT_SHA1} ${DAVE_UI_ROOT}/dockerfile/
docker tag -f ${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${GIT_SHA1} $DOCKER_HUB/${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${GIT_SHA1}
docker tag -f ${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${GIT_SHA1} $DOCKER_HUB/${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${GIT_BRANCH}

# Push the image
docker login -e="$DOCKER_EMAIL" -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker push ${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${GIT_SHA1}
docker push ${DOCKER_ORG_NAME}/${DOCKER_IMAGE_NAME}:${GIT_BRANCH}

# Clean-up
rm -rf ${DAVE_UI_ROOT}/dockerfile/dist
