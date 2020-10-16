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

import { HttpService, Inject, Injectable } from '@nestjs/common'
import { Agent } from 'https'
import IEnvConfiguration from '../../../../v1/core/integrations/configuration/interfaces/env-configuration.interface'
import { IoCTokensConstants } from '../../../../v1/core/constants/ioc'
import { Observable } from 'rxjs'
import { AxiosResponse } from 'axios'
import { ArgocdApplication } from './interfaces/argocd-application.interface'

@Injectable()
export class ArgocdApi {

  constructor(
    private readonly httpService: HttpService,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    private readonly envConfiguration: IEnvConfiguration
  ) {}



  public createSession(): Observable<AxiosResponse> {
    const agent = new Agent({  
      rejectUnauthorized: false
    })

    return this.httpService.post(
      `${this.envConfiguration.argocdUrl}/api/v1/session`,
      {
        username: this.envConfiguration.argocdUsername,
        password: this.envConfiguration.argocdPassword
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        httpsAgent: agent,
      }
    )
  }

  public createApplication(argocdApplication: ArgocdApplication): Observable<AxiosResponse> {
    const agent = new Agent({  
      rejectUnauthorized: false
    })

    console.log(this.envConfiguration.argocdUrl)
    return this.httpService.post(
      `${this.envConfiguration.argocdUrl}/api/v1/applications`,
      argocdApplication,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        httpsAgent: agent,
      }
    )
  }

  public updateApplication(argocdApplication: ArgocdApplication): Observable<AxiosResponse> {
    return this.httpService.put(
      `${this.envConfiguration.argocdUrl}/api/v1/applications/${argocdApplication.metadata.name}`,
      argocdApplication,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  public deleteApplication(applicationName: string): Observable<AxiosResponse> {
    return this.httpService.delete(
      `${this.envConfiguration.argocdUrl}/api/v1/applications/${applicationName}`,
    )
  }

  public checkStatusApplication(applicationName: string): Observable<AxiosResponse> {
    return this.httpService.get(
      `${this.envConfiguration.argocdUrl}/api/v1/applications/${applicationName}`,
    )
  }
}
