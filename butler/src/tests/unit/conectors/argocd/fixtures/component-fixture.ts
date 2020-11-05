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

import { Component, Deployment } from '../../../../../app/v2/api/deployments/interfaces'

const createComponentFixture = (id: string, name: string, imageTag: string, deployment?: Deployment) => {
  return {
    id: id,
    helmUrl: 'http://localhost:2222/helm',
    imageTag: imageTag,
    imageUrl: `https://repository.com/${name}:v1`,
    name: name,
    running: true,
    gatewayName: null,
    hostValue: null,
    deployment: deployment
  } as Component
}

export { createComponentFixture }
