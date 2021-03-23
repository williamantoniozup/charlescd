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

import { EntityRepository, Repository } from 'typeorm'
import { DeploymentStatusEnum } from '../enums/deployment-status.enum'
import { ComponentEntityV2 } from '../entity/component.entity'
import { DeploymentEvents } from '../entity/event.entity'

@EntityRepository(DeploymentEvents)
export class DeploymentEventsRepository extends Repository<DeploymentEvents> {

  public async findDeploymentEvents(deploymentId: string): Promise<DeploymentEvents | undefined> {
    return this.createQueryBuilder('v2deployment_events')
      .leftJoinAndSelect('v2deployment_events.deployment', 'deployment')
      .andWhere('deployment.id = :deploymentId', { deploymentId })
      .getOne()
  }

}
