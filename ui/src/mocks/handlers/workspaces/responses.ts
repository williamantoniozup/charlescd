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

export const WORKSPACES_LIST = {
  "content": [
    {
      "id": "da890485-b3a4-4ee3-96ca-290b06032af8",
      "name": "Workspace 1",
      "status": "COMPLETE",
      "authorId": "c7e6dafe-aa7a-4536-be1b-34eaad4c2915",
      "gitConfiguration": "",
      "registryConfiguration": "",
      "cdConfiguration": "",
      "circleMatcherUrl": "",
      "metricConfiguration": "",
      "userGroups": [],
      "createdAt": "2021-01-27 14:30:00"
    },
    {
      "id": "7e41cd61-1d0a-4fca-9237-5b46705a6ed0",
      "name": "                     sdfk.jhksjdfg                ",
      "status": "INCOMPLETE",
      "authorId": "c7e6dafe-aa7a-4536-be1b-34eaad4c2915",
      "gitConfiguration": "",
      "registryConfiguration": "",
      "cdConfiguration": "",
      "circleMatcherUrl": "",
      "metricConfiguration": "",
      "userGroups": [],
      "createdAt": "2021-01-27 14:30:58"
    },
    {
      "id": "cfc47018-c583-4e03-8c85-208334e68974",
      "name": "12",
      "status": "INCOMPLETE",
      "authorId": "c7e6dafe-aa7a-4536-be1b-34eaad4c2915",
      "gitConfiguration": "",
      "registryConfiguration": "",
      "cdConfiguration": "",
      "circleMatcherUrl": "",
      "metricConfiguration": "",
      "userGroups": [],
      "createdAt": "2021-01-26 12:54:26"
    },
    {
      "id": "7ee6241e-9443-4c39-8b47-2d5bbd610c98",
      "name": "Douglas",
      "status": "INCOMPLETE",
      "authorId": "c7e6dafe-aa7a-4536-be1b-34eaad4c2915",
      "gitConfiguration": "",
      "registryConfiguration": "",
      "cdConfiguration": "",
      "circleMatcherUrl": "",
      "metricConfiguration": "",
      "userGroups": [],
      "createdAt": "2021-02-24 13:02:25"
    },
    {
      "id": "f554b2e5-ba2f-45bb-afea-e239983c58dd",
      "name": "Ieza tests",
      "status": "COMPLETE",
      "authorId": "1770c44f-6c5f-4cac-b29d-72fd3384b5f7",
      "gitConfiguration": "",
      "registryConfiguration": "",
      "cdConfiguration": "",
      "circleMatcherUrl": "",
      "metricConfiguration": "",
      "userGroups": [
        {
          "id": "58a706ed-06e8-4662-b52e-3c308087169c",
          "name": " Profiling test",
          "author": {
            "id": "1770c44f-6c5f-4cac-b29d-72fd3384b5f7",
            "name": "rootqa",
            "email": "rootqa@root",
            "photoUrl": "",
            "createdAt": "2020-11-27 13:30:16",
            "root": false
          },
          "createdAt": "2020-11-30 18:17:48",
          "users": [
            {
              "id": "a2e3a4fa-3e9e-47fa-949b-187c72f1b652",
              "name": "Ieza Lopes",
              "email": "ieza.damasceno@zup.com.br",
              "photoUrl": "",
              "createdAt": "2020-11-30 17:31:23",
              "root": false
            }
          ]
        }
      ],
      "createdAt": "2020-11-30 18:18:33"
    }
  ],
  "page": 0,
  "size": 5,
  "totalPages": 3,
  "last": true
}

export const WORKSPACE_DATA = {
  "id": "da890485-b3a4-4ee3-96ca-290b06032af8",
  "name": "Workspace 1",
  "status": "COMPLETE",
  "authorId": "c7e6dafe-aa7a-4536-be1b-34eaad4c2915",
  "gitConfiguration": {
    "name": "ZUP",
    "id": "3199b797-3a4e-490a-b805-b7fb0eff5184"
  },
  "registryConfiguration": {
    "name": "ecr-charles-prod",
    "id": "0794d59e-d365-4f64-b47d-58fda87105de"
  },
  "cdConfiguration": {
    "name": "Octopipe",
    "id": "e61d5d0a-e2f0-4775-a777-af446fd8f2d8"
  },
  "circleMatcherUrl": "http://charlescd-circle-matcher:8080",
  "userGroups": [
    {
      "id": "0c3565ed-9bc4-43cc-adea-1f71c5ede644",
      "name": "Naive Group",
      "author": {
        "id": "c7e6dafe-aa7a-4536-be1b-34eaad4c2915",
        "name": "Charles Admin",
        "email": "charlesadmin@admin",
        "photoUrl": null,
        "createdAt": "2020-11-16 17:24:55",
        "root": false
      },
      "createdAt": "2021-01-18 19:46:49",
      "users": [
        {
          "id": "fe5edfe8-0c76-4567-b99d-f28a66e15812",
          "name": "Naive User Test",
          "email": "naive.user@test.com.br",
          "photoUrl": null,
          "createdAt": "2021-01-18 19:46:02",
          "root": false
        }
      ]
    },
    {
      "id": "bb04ec0b-8d7d-4ecb-8a7f-4103c20dc5cf",
      "name": "Developer",
      "author": {
        "id": "c7e6dafe-aa7a-4536-be1b-34eaad4c2915",
        "name": "Charles Admin",
        "email": "charlesadmin@admin",
        "photoUrl": "",
        "createdAt": "2020-11-16 17:24:55",
        "root": false
      },
      "createdAt": "2020-11-27 18:35:58",
      "users": [
        {
          "id": "a72d3444-69c8-4e9b-8c2d-5cbbed0f8229",
          "name": "Bárbara Rossalli",
          "email": "barbara.rocha@zup.com.br",
          "photoUrl": null,
          "createdAt": "2020-12-08 17:15:55",
          "root": false
        },
        {
          "id": "f985b916-3bb0-490b-8eec-6253516b924b",
          "name": "Pedro Borges",
          "email": "pedro.borges@zup.com.br",
          "photoUrl": "",
          "createdAt": "2020-11-18 20:02:57",
          "root": false
        },
        {
          "id": "84099fdc-00f1-4d8e-91b7-865aeed2ed42",
          "name": "Douglas Fernandes",
          "email": "douglas.fernandes@zup.com.br",
          "photoUrl": "",
          "createdAt": "2020-11-18 18:10:01",
          "root": false
        },
        {
          "id": "60cba5fc-df0b-45cd-bea0-033b8292b69b",
          "name": "Leandro Queiroz",
          "email": "leandro.queiroz@zup.com.br",
          "photoUrl": null,
          "createdAt": "2020-12-08 12:57:37",
          "root": false
        },
        {
          "id": "98e6deb7-943e-4fea-aabe-d195fda45283",
          "name": "Mônica",
          "email": "monicarib1@gmail.com",
          "photoUrl": null,
          "createdAt": "2021-02-03 18:48:08",
          "root": false
        },
        {
          "id": "55c04ad7-477e-4b71-be50-d73ebab024c4",
          "name": "Luane",
          "email": "luane.cavalcanti@zup.com.br",
          "photoUrl": "",
          "createdAt": "2020-11-18 18:31:44",
          "root": false
        }
      ]
    }
  ],
  "createdAt": "2020-11-20 12:56:09"
}
