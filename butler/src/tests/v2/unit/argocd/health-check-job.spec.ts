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

import { ArgocdApi } from '../../../../app/v2/core/integrations/argocd/argocd-api'
import IEnvConfiguration from '../../../../app/v1/core/integrations/configuration/interfaces/env-configuration.interface'
import { ConsoleLoggerService } from '../../../../app/v1/core/logs/console'
import { HealthCheckJob } from '../../../../app/v2/core/integrations/argocd/health-check-job'

describe('ArgoCD Deployment Health Check Job', async () => {

  it('Check deployment of one application', async () => {

    const aplicationNames = [
      'circle-id-A-v2'
    ]

    const httpService = new HttpService()
    jest.spyOn(httpService, 'get')
      .mockImplementation(() => of(createCheckStatusResponse('circle-id-A-v2')))

    const argocdApi = new ArgocdApi(httpService, {} as IEnvConfiguration)
    const healthCheckJob = new HealthCheckJob(new ConsoleLoggerService(), argocdApi)

    const result = healthCheckJob.execute(aplicationNames)

    expect(result).resolves.toBeUndefined
  })

  it('Check deployment of two applications', async () => {

    const aplicationNames = [
      'circle-id-A-v2',
      'circle-id-B-v2'
    ]

    const httpService = new HttpService()
    jest.spyOn(httpService, 'get')
      .mockImplementationOnce(() => of(createCheckStatusResponse('circle-id-A-v2')))
      .mockImplementationOnce(() => of(createCheckStatusResponse('circle-id-B-v2')))

    const argocdApi = new ArgocdApi(httpService, {} as IEnvConfiguration)
    const healthCheckJob = new HealthCheckJob(new ConsoleLoggerService(), argocdApi)

    const result = healthCheckJob.execute(aplicationNames)

    expect(result).resolves.toBeUndefined
  })

  it('Check deployment of three applications and one error', async () => {

    const aplicationNames = [
      'circle-id-A-v2',
      'circle-id-B-v2',
      'circle-id-C-v2'
    ]

    const httpService = new HttpService()
    jest.spyOn(httpService, 'get')
      .mockImplementationOnce(() => of(createCheckStatusResponse('circle-id-A-v2')))
      .mockImplementationOnce(() => of(createCheckStatusResponse('circle-id-B-v2')))
      .mockImplementation(() => of(createCheckStatusResponse('circle-id-C-v2', 'Degraded')))

    const argocdApi = new ArgocdApi(httpService, {} as IEnvConfiguration)
    const healthCheckJob = new HealthCheckJob(new ConsoleLoggerService(), argocdApi)
    const result = healthCheckJob.execute(aplicationNames)

    return expect(result)
      .rejects
      .toEqual('Timeout Error')
  })

  it('Error when trying to call argocd for health checking', async () => {

    const aplicationNames = [
      'circle-id-A-v2'
    ]

    const httpService = new HttpService()
    jest.spyOn(httpService, 'get')
      .mockImplementation(() => { throw 'Error' } )

    const argocdApi = new ArgocdApi(httpService, {} as IEnvConfiguration)
    const healthCheckJob = new HealthCheckJob(new ConsoleLoggerService(), argocdApi)
    const result = healthCheckJob.execute(aplicationNames)

    return expect(result)
      .rejects
      .toEqual('Error')
  })
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