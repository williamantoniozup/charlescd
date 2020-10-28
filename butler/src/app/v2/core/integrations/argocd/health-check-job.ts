import { Injectable } from '@nestjs/common'

import { ConsoleLoggerService } from '../../../../v1/core/logs/console'
import { ArgocdApi } from './argocd-api'

@Injectable()
export class HealthCheckJob {

  constructor(
    private consoleLoggerService: ConsoleLoggerService,
    private argocdApi: ArgocdApi
  ) { }

  public async execute(aplicationNames: string[]): Promise<boolean> {
    return true
  }
}