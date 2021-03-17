/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const ACTIVE_CIRCLES_LIST = {
  "content": [
      {
      "id": "bdd3671c-bacc-4ba3-9c53-f5860d7f4b08",
      "name": "Default",
      "reference": "a5448ff8-3c0a-4895-8965-8fd38a1892da",
      "author": {
          "id": "c7e6dafe-aa7a-4536-be1b-34eaad4c2915",
          "name": "Charles Admin",
          "email": "charlesadmin@admin",
          "photoUrl": "",
          "createdAt": "2020-11-16 17:24:55",
          "root": false
      },
      "createdAt": "2020-11-20 19:55:52",
      "matcherType": "REGULAR",
      "importedKvRecords": 0,
      "default": true,
      "deployment": {
          "id": "37eedca5-8001-483b-bfe8-fcdb373e2dc7",
          "author": {
          "id": "c7e6dafe-aa7a-4536-be1b-34eaad4c2915",
          "name": "Charles Admin",
          "email": "charlesadmin@admin",
          "photoUrl": "",
          "createdAt": "2020-11-16 17:24:55",
          "root": false
          },
          "createdAt": "2021-03-17 17:12:33",
          "deployedAt": "2021-03-17 17:15:20",
          "circle": {
          "id": "bdd3671c-bacc-4ba3-9c53-f5860d7f4b08",
          "name": "Default",
          "author": {
              "id": "c7e6dafe-aa7a-4536-be1b-34eaad4c2915",
              "name": "Charles Admin",
              "email": "charlesadmin@admin",
              "photoUrl": "",
              "createdAt": "2020-11-16 17:24:55",
              "root": false
          },
          "createdAt": "2020-11-20 19:55:52",
          "matcherType": "REGULAR",
          "rules": {
            "rules": {
              "type": "CLAUSE",
              "clauses": [
                {
                  "type": "RULE",
                  "content": {
                    "key": "username",
                    "value": [
                      "mock@zup.com.br"
                    ],
                    "condition": "EQUAL"
                  }
                }
              ],
              "logicalOperator": "OR"
            }
          },
          "importedKvRecords": 0
          },
          "buildId": "727d72f6-f935-40ac-8b4e-24bf34163fe9",
          "tag": "release-darwin-hotfix-percentage",
          "status": "DEPLOYED",
          "artifacts": [
          {
              "id": "e29622ce-5444-4001-a9c1-367fda200ae0",
              "artifact": "462986224002.dkr.ecr.us-east-1.amazonaws.com/charlescd-moove:release-darwin-hotfix-percentage",
              "version": "release-darwin-hotfix-percentage",
              "createdAt": "2021-03-17 17:12:32",
              "componentName": "charlescd-moove",
              "moduleName": "ZupIT/charlescd"
          }
          ]
      },
      "workspaceId": "7d82d424-d545-4df4-ace7-e464185d0fc4"
      }
  ],
  "page": 1,
  "size": 1,
  "totalPages": 1,
  "last": true
}
  