import { Injectable, Inject } from '@nestjs/common'

import { ConsoleLoggerService } from '../../../../v1/core/logs/console'
import { ArgocdApi } from './argocd-api'
import { IoCTokensConstants } from '../../../../v1/core/constants/ioc'
import IEnvConfiguration from '../../../../v1/core/integrations/configuration/interfaces/env-configuration.interface'

@Injectable()
export class HealthCheckJob {

  constructor(
    private consoleLoggerService: ConsoleLoggerService,
    private argocdApi: ArgocdApi,
    @Inject(IoCTokensConstants.ENV_CONFIGURATION)
    private readonly envConfiguration: IEnvConfiguration
  ) { }

  public async execute(applicationNames: string[]): Promise<void> {
    let applicationsStatus = this.toApplicationStatus(applicationNames)

    return new Promise((resolve, reject) => {
      const healthCkeckJob = setInterval(async () => {
        const healthy = this.isAllApplicationsHealthy(applicationsStatus)
        if (healthy) {
          clearInterval(healthCkeckJob)
          clearTimeout(healthCkeckJobTimeout)
          resolve()
          return
        }

        try {
          applicationsStatus = await this.healthCheck(applicationNames)
        } catch (error) {
          clearInterval(healthCkeckJob)
          clearTimeout(healthCkeckJobTimeout)
          reject(error)
        }
      }, this.envConfiguration.argocdHealthCheckInterval)

      const healthCkeckJobTimeout = setTimeout(async () => {
        clearInterval(healthCkeckJob)
        reject('Timeout Error')
      }, this.envConfiguration.argocdHealthCheckTimeout)
    })
  }

  private async healthCheck(applicationNames: string[]): Promise<Record<string, boolean>> {
    const healthCheckCalls = applicationNames.map(name => this.argocdApi.checkStatusApplication(name).toPromise())
    const result = await Promise.all(healthCheckCalls)

    const applicationsStatus = this.toApplicationStatus(applicationNames)
    result.forEach(response => {
      applicationsStatus[response.data.metadata.name] = response.data.status.health.status == 'Healthy'
    })
    return applicationsStatus
  }

  private isAllApplicationsHealthy(applicationsStatus: Record<string, boolean>): boolean {
    const applicationNames = Object.keys(applicationsStatus)
    return !applicationNames.find(name => !applicationsStatus[name])
  }

  private toApplicationStatus(applicationNames: string[]): Record<string, boolean> {
    return applicationNames.reduce((acc, applicationName) => {
      acc[applicationName] = false
      return acc
    }, {} as Record<string, boolean>)
  }
}