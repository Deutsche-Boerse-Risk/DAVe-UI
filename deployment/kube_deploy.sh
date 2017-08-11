#!/usr/bin/env bash

curl -O https://storage.googleapis.com/kubernetes-release/release/v1.4.6/bin/linux/amd64/kubectl
chmod +x kubectl

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

./kubectl config set-cluster dave --insecure-skip-tls-verify=true --server=${KUBE_API}
./kubectl config set-credentials dave --username ${KUBE_USERNAME} --password ${KUBE_PASSWORD}
#./kubectl config set-credentials ${KUBE_USERNAME} --token ${KUBE_PASSWORD}
./kubectl config set-context default-context --cluster=dave --user=dave
./kubectl config use-context default-context
./kubectl set image deployment/dave-ui dave-ui=dbgdave/dave-ui:${CIRCLE_SHA1} --namespace=${CIRCLE_BRANCH}
