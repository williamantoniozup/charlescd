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

import * as fs from 'fs'
import * as path from 'path'

import 'jest'
import { HttpService } from '@nestjs/common'
import { of } from 'rxjs'
import { AxiosResponse } from 'axios'

import { GitHubRepository } from '../../../../app/v2/core/integrations/github/github-repository'
import { ConsoleLoggerService } from '../../../../app/v2/core/logs/console/console-logger.service'
import { ConfigurationConstants } from '../../../../app/v2/core/constants/application/configuration.constants'
import { CreateDeploymentUseCase } from '../../../../app/v2/api/deployments/use-cases/create-deployment.usecase'
import { DeploymentRepositoryV2 } from '../../../../app/v2/api/deployments/repository/deployment.repository'
import { ComponentsRepositoryV2 } from '../../../../app/v2/api/deployments/repository'
import { K8sClient } from '../../../../app/v2/core/integrations/k8s/client'
import { HelmManifest } from '../../../../app/v2/core/manifests/helm/helm-manifest'
import { GitLabRepository } from '../../../../app/v2/core/integrations/gitlab/gitlab-repository'
import { RepositoryFactory } from 'typeorm/repository/RepositoryFactory'
import { RepositoryStrategyFactory } from '../../../../app/v2/core/integrations/repository-strategy-factory'
import IEnvConfiguration from '../../../../app/v2/core/configuration/interfaces/env-configuration.interface'
import {GitProvidersEnum} from "../../../../app/v2/core/configuration/interfaces";
import {UrlConstants} from "../../integration/test-constants";
import {CreateDeploymentRequestDto} from "../../../../app/v2/api/deployments/dto/create-deployment-request.dto";

describe('Create Deployment useCase tests', () => {

  const deploymentsRepository = new DeploymentRepositoryV2()
  const componentsRepository = new ComponentsRepositoryV2()
    
  const envConfiguration = { butlerNamespace: 'default' } as IEnvConfiguration
  const httpService = new HttpService()
  const consoleLoggerService = new ConsoleLoggerService()
  const gitlabRepository = new GitLabRepository(consoleLoggerService, httpService)
  const githubRepository = new GitHubRepository(consoleLoggerService, httpService)
    
    
  const repositoryFactory = new RepositoryStrategyFactory(githubRepository, gitlabRepository, consoleLoggerService)
  const k8sClient = new K8sClient(consoleLoggerService, envConfiguration)
  const helmManifest = new HelmManifest(consoleLoggerService, repositoryFactory)
    
  it('when is a incremental deployment should concat the correct previous deployment components with actual deployment', async() => {
    const createDeploymentRequest = {
      deploymentId: '28a3f957-3702-4c4e-8d92-015939f39cf2',
      circle: {
        id: 'fcd22a4e-c192-4c86-bca2-f23de7b73757',
        default: false
      },
      git: {
        token: 'base64Token',
        provider: GitProvidersEnum.GITHUB
      },
      components: [
        {
          helmRepository: UrlConstants.helmRepository,
          componentId: '777765f8-bb29-49f7-bf2b-3ec956a71583',
          buildImageUrl: 'imageurl.com',
          buildImageTag: 'v2',
          componentName: 'A'
        }
      ],
      authorId: '580a7726-a274-4fc3-9ec1-44e3563d58af',
      callbackUrl: UrlConstants.deploymentCallbackUrl,
      timeoutInSeconds: 10,
      namespace: 'my-namespace',
      overrideCircle: false
    } as CreateDeploymentRequestDto
    const deploymentUseCase = new CreateDeploymentUseCase(deploymentsRepository, componentsRepository, consoleLoggerService, k8sClient, helmManifest)
    await deploymentUseCase.execute(createDeploymentRequest, null)

  })


})
