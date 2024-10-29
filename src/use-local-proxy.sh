#!/bin/bash

replace_proxy() {
  local search=$1
  local replace=$2
  local file_path=$3
  local temp_file=$(mktemp)
  sed "s/$search/$replace/g" "$(git rev-parse --show-toplevel)/$file_path" > "$temp_file"
  mv "$temp_file" "$(git rev-parse --show-toplevel)/$file_path"
}

cleanup_start() {
  replace_proxy "localhost:44300" "kitos-dev\\.strongminds\\.dk" "src/proxy.conf.json"
}

cleanup_swagger() {
  replace_proxy "localhost:44300" "kitos-dev\\.strongminds\\.dk" "openapitools.json"
}


if [ "$1" = "start" ]; then
  trap cleanup_start EXIT

  replace_proxy "kitos-dev\\.strongminds\\.dk" "localhost:44300" "src/proxy.conf.json"
  yarn start
fi

 if [ "$1" = "swagger" ]; then
   trap cleanup_swagger EXIT

   replace_proxy "kitos-dev\\.strongminds\\.dk" "localhost:44300" "openapitools.json"
   yarn swagger
 fi
