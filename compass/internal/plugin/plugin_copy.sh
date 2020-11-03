#!/bin/bash
#
#
#  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#
#
originFolder="$1"
destinationFolder="$2"
shift 2
for pluginCategory in "$@"; do
  mkdir -o /"$originFolder"/"$pluginCategory"/

  for pluginSrc in ./"$originFolder"/"$pluginCategory"/*/; do
    err="$(cp -r "$pluginSrc" "$destinationFolder"/"$pluginCategory"/ 2>&1)"
    if [ -z "$err" ]; then
      pluginHash="$(find "$pluginSrc" -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum)"
      pluginSrc=${pluginSrc%*/}
      pluginSrc=${pluginSrc##*/}
      printf "Success:%s:%s:%s;" "$pluginCategory" "$pluginSrc" "$pluginHash"
    else
      pluginSrc=${pluginSrc%*/}
      pluginSrc=${pluginSrc##*/}
      printf "Error:%s:%s:%s;" "$pluginCategory" "$pluginSrc" "$err"
    fi
  done
done
