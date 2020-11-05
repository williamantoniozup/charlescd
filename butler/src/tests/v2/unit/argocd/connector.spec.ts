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

import 'jest'
import { of } from 'rxjs'
import { HttpService } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { CdTypeEnum } from '../../../../app/v1/api/configurations/enums'
import { Component, Deployment } from '../../../../app/v2/api/deployments/interfaces'
import { GitProvidersEnum } from '../../../../app/v1/core/integrations/configuration/interfaces'
import { ClusterProviderEnum } from '../../../../app/v1/core/integrations/octopipe/interfaces/octopipe-payload.interface'
import { ArgocdConnector } from '../../../../app/v2/core/integrations/argocd/connector'
import { ConsoleLoggerService } from '../../../../app/v1/core/logs/console'
import { ArgocdApi } from '../../../../app/v2/core/integrations/argocd/argocd-api'
import IEnvConfiguration from '../../../../app/v1/core/integrations/configuration/interfaces/env-configuration.interface'
import { HealthCheckJob } from '../../../../app/v2/core/integrations/argocd/health-check-job'

const deploymentWith3Components: Deployment = {
  id: 'deployment-id',
  authorId: 'user-1',
  callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=1',
  cdConfiguration: {
    id: 'cd-configuration-id',
    type: CdTypeEnum.ARGOCD,
    configurationData: {
      namespace: 'sandbox'
    },
    name: 'argocdconfiguration',
    authorId: 'user-2',
    workspaceId: 'workspace-id',
    createdAt: new Date(),
    deployments: null
  },
  circleId: 'circle-id',
  createdAt: new Date(),
  components: [
    {
      id: 'component-id-1',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v2',
      imageUrl: 'https://repository.com/A:v2',
      name: 'A',
      running: false,
      gatewayName: null,
      hostValue: null
    },
    {
      id: 'component-id-2',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v2',
      imageUrl: 'https://repository.com/B:v2',
      name: 'B',
      running: false,
      gatewayName: null,
      hostValue: null
    },
    {
      id: 'component-id-3',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v2',
      imageUrl: 'https://repository.com/C:v2',
      name: 'C',
      running: false,
      gatewayName: null,
      hostValue: null
    }
  ]
}

describe('ArgoCD Deployment', async () => {

  const activeComponents: Component[] = [
    {
      id: 'component-id-4',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v1',
      imageUrl: 'https://repository.com/A:v1',
      name: 'A',
      running: true,
      gatewayName: null,
      hostValue: null,
      deployment: {
        id: 'deployment-id4',
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
    },
    {
      id: 'component-id-5',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v1',
      imageUrl: 'https://repository.com/B:v1',
      name: 'B',
      running: true,
      gatewayName: null,
      hostValue: null,
      deployment: {
        id: 'deployment-id5',
        authorId: 'user-1',
        callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=5',
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
    },
    {
      id: 'component-id-6',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v0',
      imageUrl: 'https://repository.com/A:v0',
      name: 'A',
      running: true,
      gatewayName: null,
      hostValue: null,
      deployment: {
        id: 'deployment-id6',
        authorId: 'user-1',
        callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=6',
        circleId: null,
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
    },
    {
      id: 'component-id-7',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v0',
      imageUrl: 'https://repository.com/B:v0',
      name: 'B',
      running: true,
      gatewayName: null,
      hostValue: null,
      deployment: {
        id: 'deployment-id7',
        authorId: 'user-1',
        callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=7',
        circleId: null,
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
    },
    {
      id: 'component-id-8',
      helmUrl: 'http://localhost:2222/helm',
      imageTag: 'v0',
      imageUrl: 'https://repository.com/C:v0',
      name: 'C',
      running: true,
      gatewayName: null,
      hostValue: null,
      deployment: {
        id: 'deployment-id8',
        authorId: 'user-1',
        callbackUrl: 'http://localhost:1234/notifications/deployment?deploymentId=8',
        circleId: null,
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
  ]

  let envConfiguration: IEnvConfiguration

  beforeEach(async () => {
    envConfiguration = { 
      argocdHealthCheckInterval: 1000,
      argocdHealthCheckTimeout: 3000
     } as IEnvConfiguration
  })

  it('should create a deployment with success', async () => {

    const httpService = new HttpService()
    jest.spyOn(httpService, 'post').mockImplementation(() => of({} as AxiosResponse))
    jest.spyOn(httpService, 'get')
      .mockImplementationOnce(() => of(createCheckStatusResponse('circle-id-A-v2')))
      .mockImplementationOnce(() => of(createCheckStatusResponse('circle-id-B-v2')))
      .mockImplementationOnce(() => of(createCheckStatusResponse('circle-id-C-v2')))

    const argocdApi = new ArgocdApi(httpService, envConfiguration)
    const healthCheckJob = new HealthCheckJob(new ConsoleLoggerService(), argocdApi, envConfiguration)
    const connector = new ArgocdConnector(new ConsoleLoggerService(), argocdApi, healthCheckJob)
    const result = await connector.createDeployment(deploymentWith3Components, activeComponents)

    expect(
      result
    ).toEqual({ status: "SUCCEEDED" })
  })

  function createCheckStatusResponse(aplicationName: string, status = 'Healthy') {
    return {
      data: {
        metadata: {
          name: aplicationName
        },
        status: {
          health: {
            status: status
          }
        }
      }
    } as AxiosResponse
  }
})