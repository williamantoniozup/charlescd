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

const createDeploymentFixture = (id: string, components?: Component[], circleId: string | null = 'b46fd548-0082-4021-ba80-a50703c44a3b') => {
  return {
    id: id,
    authorId: 'user-1',
    callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=1',
    circleId: circleId,
    createdAt: new Date(),
    components: components,
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
  } as Deployment
}

export { createDeploymentFixture }
