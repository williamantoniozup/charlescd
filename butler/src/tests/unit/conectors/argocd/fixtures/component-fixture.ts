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

import { CdTypeEnum } from '../../../../../app/v1/api/configurations/enums'
import { Component, Deployment } from '../../../../../app/v2/api/deployments/interfaces'
import { GitProvidersEnum } from '../../../../../app/v1/core/integrations/configuration/interfaces'
import { ClusterProviderEnum } from '../../../../../app/v1/core/integrations/octopipe/interfaces/octopipe-payload.interface'

const createComponentFixture = (id: string, name: string, imageTag: string, deployment?: Deployment) => {

  if(!deployment) {
    deployment = {
      id: '', //deploymentId,
      authorId: 'user-1',
      callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=4',
      circleId: 'circle-id',
      createdAt: new Date(),
      cdConfiguration: {
        id: 'cd-configuration-id',
        type: CdTypeEnum.ARGOCD,
        configurationData: {
          gitProvider: GitProvidersEnum.GITHUB,
          gitToken: 'git-token',
          provider: ClusterProviderEnum.DEFAULT,
          namespace: 'sandbox'
        },
        name: 'argocdconfiguration',
        authorId: 'user-2',
        workspaceId: 'workspace-id',
        createdAt: new Date(),
        deployments: null
      }
    }
  }

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
