#!/bin/sh
category=$1
plugin=$2
go build -buildmode=plugin -o ./dist/"$category"/"$plugin"/"$plugin".so ./plugins/"$category"/"$plugin"/*.go
cp ./plugins/"$category"/"$plugin"/readme.json ./dist/"$category"/"$plugin"/readme.json
echo Plugin "$plugin" builded