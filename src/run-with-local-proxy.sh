#!/bin/bash

replace_proxy() {
  local search=$1
  local replace=$2
  vim -c "%s/$search/$replace/g" -c "wq" "$(git rev-parse --show-toplevel)/src/proxy.conf.json"
}

cleanup() {
  replace_proxy "localhost:44300" "kitos-dev\\.strongminds\\.dk"
}

trap cleanup EXIT

replace_proxy "kitos-dev\\.strongminds\\.dk" "localhost:44300"
yarn start

