/*
 *
 *  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package io.charlescd.moove.application

import io.charlescd.moove.domain.Deployment
import io.charlescd.moove.domain.DeploymentStatusEnum
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.DeploymentRepository
import java.util.*
import javax.inject.Named

@Named
class DeploymentService(private val deploymentRepository: DeploymentRepository) {

    fun save(deployment: Deployment): Deployment {
        return this.deploymentRepository.save(deployment)
    }

    fun update(deployment: Deployment): Deployment {
        return this.deploymentRepository.update(deployment)
    }

    fun findByCircleIdAndWorkspaceId(circleId: String, workspaceId: String): List<Deployment> {
        return this.deploymentRepository.findByCircleIdAndWorkspaceId(circleId, workspaceId)
    }

    fun findByCircleIdAndStatus(circleId: String, status: DeploymentStatusEnum): Optional<Deployment> {
        return this.deploymentRepository.find(circleId, status)
    }

    fun updateStatus(id: String, status: DeploymentStatusEnum) {
        deploymentRepository.updateStatus(id, status)
    }

    fun deleteByCircleId(circleId: String) {
        deploymentRepository.deleteByCircleId(circleId)
    }

    fun find(id: String): Deployment {
        return this.deploymentRepository.findById(
            id
        ).orElseThrow {
            NotFoundException("deployment", id)
        }
    }

    fun findByIdAndWorkspaceId(id: String, workspaceId: String): Deployment {
        return this.deploymentRepository.find(
            id,
            workspaceId
        ).orElseThrow {
            NotFoundException("deployment", id)
        }
    }

    fun findLastActive(circleId: String): Deployment? {
        return this.deploymentRepository.findActiveByCircleId(
            circleId
        ).maxBy { it.createdAt }
    }

    fun findLastActive(circleId: String, workspaceId: String): Deployment? {
        return this.deploymentRepository.findActiveByCircleIdAndWorkspaceId(
            circleId, workspaceId
        ).maxBy { it.createdAt }
    }

    fun findActiveList(circleId: String): List<Deployment> {
        return this.deploymentRepository.findActiveByCircleId(
            circleId
        )
    }

    fun findActiveList(circleId: String, workspaceId: String): List<Deployment> {
        return this.deploymentRepository.findActiveByCircleIdAndWorkspaceId(
            circleId, workspaceId
        )
    }

    fun existsActiveListByWorkspace(workspaceId: String): Boolean {
        return this.deploymentRepository.existActiveListByWorkspaceId(workspaceId)
    }
}
