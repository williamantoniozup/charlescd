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
import { of, throwError } from 'rxjs'
import { AxiosResponse } from 'axios'

import { GitHubRepository } from '../../../../app/v2/core/integrations/github/github-repository'
import { ConsoleLoggerService } from '../../../../app/v2/core/logs/console'
import { ConfigurationConstants } from '../../../../app/v2/core/constants/application/configuration.constants'
import IEnvConfiguration from '../../../../app/v2/core/configuration/interfaces/env-configuration.interface'

describe('Download resources from github', () => {
  const contents = getStubContents()
  const httpService = new HttpService()
  jest.spyOn(httpService, 'get')
    .mockImplementation(resourceName => of({
      data: contents[resourceName]
    } as AxiosResponse))

  const url = 'https://api.github.com/repos/charlescd-fake/helm-chart/contents?ref=master'

  const envConfiguration = { rejectUnauthorizedTLS: true } as IEnvConfiguration

  it('Download helm chart recursively from github', async() => {
    const repository = new GitHubRepository(new ConsoleLoggerService(), httpService, envConfiguration)

    const resource = await repository.getResource({ url: url, token: 'my-token', resourceName: 'helm-chart' })

    expect(resource.name).toBe('helm-chart')
    expect(resource.type).toBe('directory')
    expect(resource.children).toHaveLength(3)

    const template = resource.children?.[2]
    expect(template?.children).toHaveLength(2)
  })

  it('Download a single file from gibhub', async() => {
    const repository = new GitHubRepository(new ConsoleLoggerService(), httpService, envConfiguration)

    const resource = await repository.getResource({ url: url, token: 'my-token', resourceName: 'helm-chart/Chart.yaml' })

    expect(resource.name).toBe('Chart.yaml')
    expect(resource.type).toBe('file')
    expect(resource.content).toBeTruthy()
  })

  it('Download helm chart recursively from github from feature branch', async() => {
    const repository = new GitHubRepository(new ConsoleLoggerService(), httpService, envConfiguration)

    const resource = await repository.getResource({ url: url, token: 'my-token', resourceName: 'helm-chart' })

    expect(resource.name).toBe('helm-chart')
    expect(resource.type).toBe('directory')
    expect(resource.children).toHaveLength(3)

    const template = resource.children?.[2]
    expect(template?.children).toHaveLength(2)
  })

  it('Should invoke the github api service with the correct configuration object', async() => {
    const githubToken = 'github-auth-token123'
    const repository = new GitHubRepository(new ConsoleLoggerService(), httpService, envConfiguration)
    const expectedRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${githubToken}`
      },
      timeout: ConfigurationConstants.CHART_DOWNLOAD_TIMEOUT,
      httpsAgent: expect.anything()
    }

    const getSpy = jest.spyOn(httpService, 'get')

    await repository.getResource({ url: url, token: githubToken, resourceName: 'helm-chart' })
    expect(getSpy).toHaveBeenCalledWith(expect.anything(), expectedRequestConfig)
  })

  it('should thrown error with the  maximum retry attempts message error', async() => {
    const errorMessage = 'Timeout of 500ms'
    jest.spyOn(httpService, 'get')
      .mockImplementation(() =>
        throwError(errorMessage)
      )
    const repository = new GitHubRepository(new ConsoleLoggerService(), httpService, envConfiguration)
    await expect(
      repository.getResource({ url: url, token: 'my-token', resourceName: 'helm-chart' })
    ).rejects.toMatchObject({
      response: {
        errors: [{
          detail: `Status 'INTERNAL_SERVER_ERROR' with error: ${errorMessage}`,
          source: 'components.helmRepository',
          status: 500,
          title: 'Unable to fetch resource from github url: https://api.github.com/repos/charlescd-fake/helm-chart/contents/helm-chart?ref=master'
        }]
      }
    })
  })
})

function getStubContents() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../../', 'stubs/helm-chart/github-contents.json'), 'utf8'))
}
