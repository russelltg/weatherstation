#!/bin/bash

set -ex

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $DIR

yarn --cwd ../data-visualizer build
packr
cd ~/go/src/github.com/russelltg/server
xgo --targets=linux/arm-7 .
packr clean
