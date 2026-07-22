#!/bin/bash

replace_proxy() {
  local search=$1
  local replace=$2
  local file_path=$3
  local temp_file=$(mktemp)
  sed "s|$search|$replace|g" "$(git rev-parse --show-toplevel)/$file_path" > "$temp_file"
  mv "$temp_file" "$(git rev-parse --show-toplevel)/$file_path"
}

cleanup_start() {
  replace_proxy "http://localhost:5000" "https://kitos-dev\\.strongminds\\.dk" "src/proxy.conf.json"
}

if [ "$1" = "start" ]; then
  trap cleanup_start EXIT

  replace_proxy "https://kitos-dev\\.strongminds\\.dk" "http://localhost:5000" "src/proxy.conf.json"
  yarn start
fi
