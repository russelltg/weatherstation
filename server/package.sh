set -ex

yarn --cwd ../data-visualizer build
packr
cd ~/go/src/github.com/russelltg/server
xgo --targets=linux/arm-7 .
packr clean