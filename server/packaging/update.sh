#!/bin/bash

set -ex

../cross_compile.sh


sudo mount -o loop,offset=50331648  $1 /mnt

sudo cp ../server-linux-arm-7 /mnt/opt/weatherstation/server
sudo cp ./weatherstation.service /mnt/etc/systemd/system/weatherstation.service
sudo cp ./nginx.conf /mnt/etc/nginx/nginx.conf

sudo umount /mnt

