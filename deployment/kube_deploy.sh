#!/usr/bin/env bash

curl -O https://storage.googleapis.com/kubernetes-release/release/v1.4.6/bin/linux/amd64/kubectl
chmod +x kubectl

./kubectl config set-cluster dave --insecure-skip-tls-verify=true --server=${KUBE_API}
./kubectl config set-credentials ${KUBE_USERNAME} --token ${KUBE_PASSWORD}
./kubectl config set-context default-context --cluster=dave --user=${KUBE_USERNAME}
./kubectl config use-context default-context
./kubectl set image deployment/ui dave=scholzj/dave-ui:${CIRCLE_SHA1} --namespace=master
