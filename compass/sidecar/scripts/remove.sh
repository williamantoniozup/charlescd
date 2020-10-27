#!/bin/sh
category=$1
plugin=$2
rm -r ./dist/"$category"/"$plugin"/
echo Plugin "$plugin" removed