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

import { Injectable } from '@nestjs/common'
import { ConsoleLoggerService } from '../../../../v1/core/logs/console'
import { Component, Deployment } from '../../../api/deployments/interfaces'
import { CdConnector } from '../interfaces/cd-connector.interface'
import { ConnectorResult, ConnectorResultError } from '../spinnaker/interfaces'
import { ArgocdDeploymentRequest, ArgocdUndeploymentRequest } from './interfaces/argocd-deployment.interface'
import { ArgocdApi } from './argocd-api'
import { ArgoCdRequestBuilder } from './request-builder'
import { HealthCheckJob } from './health-check-job'

@Injectable()
export class ArgocdConnector implements CdConnector {

  constructor(
    private consoleLoggerService: ConsoleLoggerService,
    private argocdApi: ArgocdApi,
    private healthCheckJob: HealthCheckJob
  ) { }

  public async createDeployment(
    deployment: Deployment,
    activeComponents: Component[]
  ): Promise<ConnectorResult | ConnectorResultError> {

    try {
      this.consoleLoggerService.log('START:CREATE_V2_ARGOCD_DEPLOYMENT', { deployment: deployment.id, activeComponents: activeComponents.map(c => c.id) })
      const argocdDeployment = new ArgoCdRequestBuilder().buildDeploymentRequest(deployment, activeComponents)
      this.consoleLoggerService.log('GET:ARGOCD_DEPLOYMENT_OBJECT', { argocdDeployment })
      await this.createComponentDeployments(argocdDeployment)
      return { status: 'SUCCEEDED' } as ConnectorResult
    } catch (error) {
      this.consoleLoggerService.log('ERROR:CREATE_V2_ARGOCD_DEPLOYMENT', { error })
      return { status: 'ERROR', error: error } as ConnectorResultError
    }
  }

  private async createComponentDeployments(argocdDeployment: ArgocdDeploymentRequest): Promise<void> {
    const argocdRequests = argocdDeployment.newDeploys.map((application) => {
      return this.argocdApi.createApplication(application)
    })
    const componentDeployments = argocdRequests.map(async (response) => response.toPromise())
    return await Promise.all(componentDeployments) // TODO: createApplication retornar promise?
      .then(async () => {
        this.consoleLoggerService.log('POST:ARGOCD_CREATE_APPLICATION_SUCCESS')
        const applicationNames = argocdDeployment.newDeploys.map(application => application.metadata.name)
        await this.healthCheckJob.execute(applicationNames)
      })
      .catch(error => {
        this.consoleLoggerService.log('POST:ARGOCD_CREATE_APPLICATION_ERROR', { error })
        return error
      })
  }

  public async createUndeployment(
    deployment: Deployment,
    activeComponents: Component[]
  ): Promise<ConnectorResult | ConnectorResultError> {

    try {
      this.consoleLoggerService.log('START:CREATE_V2_OCTOPIPE_UNDEPLOYMENT', { deployment: deployment.id, activeComponents: activeComponents.map(c => c.id) })
      const argocdUndeployment = new ArgoCdRequestBuilder().buildUndeploymentRequest(deployment, activeComponents)
      this.consoleLoggerService.log('GET:OCTOPIPE_UNDEPLOYMENT_OBJECT', { argocdUndeployment })
      // await this.octopipeApi.undeploy(argocdUndeployment, configuration.incomingCircleId).toPromise()
      this.consoleLoggerService.log('FINISH:CREATE_V2_ARGOCD_UNDEPLOYMENT')
      return { status: 'SUCCEEDED' }
    } catch (error) {
      this.consoleLoggerService.log('ERROR:CREATE_V2_ARGOCD_UNDEPLOYMENT', { error })
      return { status: 'ERROR', error: error }
    }
  }
}
