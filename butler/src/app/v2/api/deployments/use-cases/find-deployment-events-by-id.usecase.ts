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
import { InjectRepository } from '@nestjs/typeorm'
import { DeploymentEvents } from '../entity/event.entity'
import { DeploymentEventsRepository } from '../repository/event.repository'

export class FindDeploymentEventsByIdUsecase {

  constructor(
        @InjectRepository(DeploymentEvents)
        private readonly eventsRepository: DeploymentEventsRepository
  ){}
    
  public async execute(deploymentId: string): Promise<DeploymentEvents | undefined> {
    return this.eventsRepository.findDeploymentEvents(deploymentId)
  }
}