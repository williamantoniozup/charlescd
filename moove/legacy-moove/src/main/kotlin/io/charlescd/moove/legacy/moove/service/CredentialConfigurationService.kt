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

package io.charlescd.moove.legacy.moove.service

import io.charlescd.moove.commons.exceptions.NotFoundExceptionLegacy
import io.charlescd.moove.commons.extension.toRepresentation
import io.charlescd.moove.commons.extension.toSimpleRepresentation
import io.charlescd.moove.commons.representation.CredentialConfigurationRepresentation
import io.charlescd.moove.legacy.moove.api.DeployApi
import io.charlescd.moove.legacy.moove.api.VillagerApi
import io.charlescd.moove.legacy.moove.api.request.CreateDeployCdConfigurationRequest
import io.charlescd.moove.legacy.moove.api.request.CreateVillagerRegistryConfigurationProvider
import io.charlescd.moove.legacy.moove.api.request.CreateVillagerRegistryConfigurationRequest
import io.charlescd.moove.legacy.moove.api.response.CreateDeployCdConfigurationResponse
import io.charlescd.moove.legacy.moove.api.response.CreateVillagerRegistryConfigurationResponse
import io.charlescd.moove.legacy.moove.api.response.GetDeployCdConfigurationsResponse
import io.charlescd.moove.legacy.moove.request.configuration.*
import io.charlescd.moove.legacy.repository.CredentialConfigurationRepository
import io.charlescd.moove.legacy.repository.entity.CredentialConfiguration
import io.charlescd.moove.legacy.repository.entity.CredentialConfigurationType
import io.charlescd.moove.legacy.repository.entity.User
import java.time.LocalDateTime
import java.util.*
import org.springframework.stereotype.Service

@Service
class CredentialConfigurationService(
    val credentialConfigurationRepository: CredentialConfigurationRepository,
    val userServiceLegacy: UserServiceLegacy,
    val deployApi: DeployApi,
    val villagerApi: VillagerApi
) {

    companion object {
        const val GIT_SERVICE_NAME = "git"
        const val REGISTRY_SERVICE_NAME = "registry"
        const val CD_SERVICE_NAME = "cd"
    }

    fun createRegistryConfig(
        createRegistryConfigRequest: CreateRegistryConfigurationRequest,
        workspaceId: String,
        authorization: String
    ): CredentialConfigurationRepresentation {

        val user: User = userServiceLegacy.findByToken(authorization)

        val villagerRequest: CreateVillagerRegistryConfigurationRequest =
            buildVillagerRegistryConfigurationRequest(createRegistryConfigRequest, user.id)

        val villagerResponse: CreateVillagerRegistryConfigurationResponse =
            villagerApi.createRegistryConfiguration(villagerRequest, workspaceId)

        return CredentialConfigurationRepresentation(
            villagerResponse.id,
            createRegistryConfigRequest.name,
            user.toSimpleRepresentation()
        )
    }

    fun createCdConfig(
        createCdConfigRequest: CreateCdConfigurationRequest,
        workspaceId: String,
        authorization: String
    ): CredentialConfigurationRepresentation {

        val user: User = userServiceLegacy.findByToken(authorization)

        val deployRequest: CreateDeployCdConfigurationRequest =
            buildDeployCdConfigurationRequest(createCdConfigRequest)
        val deployResponse: CreateDeployCdConfigurationResponse =
            deployApi.createCdConfiguration(deployRequest, workspaceId)

        return CredentialConfigurationRepresentation(
            deployResponse.id,
            deployResponse.name,
            user.toSimpleRepresentation()
        )
    }

    fun getConfigurationById(id: String, workspaceId: String): CredentialConfigurationRepresentation {
        return credentialConfigurationRepository.findByIdAndWorkspaceId(id, workspaceId)
            .orElseThrow { NotFoundExceptionLegacy("configuration", id) }
            .toRepresentation()
    }

    fun getConfigurationsByType(workspaceId: String): Map<String, List<CredentialConfigurationRepresentation>> {
        return mapOf(
            GIT_SERVICE_NAME to credentialConfigurationRepository.findAllByWorkspaceId(workspaceId)
                .filterCredentialsByType(CredentialConfigurationType.GIT),
            REGISTRY_SERVICE_NAME to getVillagerRegistryConfigurations(workspaceId),
            CD_SERVICE_NAME to getDeployCdConfigurations(workspaceId)
        )
    }

    fun deleteCdConfigurationById(workspaceId: String, cdConfigurationId: String) {
        if (!checkIfCdConfigurationExists(cdConfigurationId, workspaceId)) {
            throw NotFoundExceptionLegacy("cdConfigurationId", cdConfigurationId)
        }

        deployApi.deleteCdConfiguration(cdConfigurationId, workspaceId)
    }

    private fun checkIfCdConfigurationExists(id: String, workspaceId: String): Boolean {
        val cdConfigurationList = deployApi.getCdConfigurations(workspaceId)
        return cdConfigurationList.filter { cd ->
            cd.id == id
        }.any()
    }

    private fun List<CredentialConfiguration>.filterCredentialsByType(type: CredentialConfigurationType): List<CredentialConfigurationRepresentation> {
        return this.filter { it.type == type }.map { it.toRepresentation() }
    }

    private fun buildVillagerRegistryConfigurationRequest(
        createRegistryConfigRequest: CreateRegistryConfigurationRequest,
        authorId: String
    ): CreateVillagerRegistryConfigurationRequest {
        return when (createRegistryConfigRequest) {
            is CreateAzureRegistryConfigurationRequest -> buildAzureRegistryRequest(createRegistryConfigRequest, authorId)
            is CreateAWSRegistryConfigurationRequest -> buildAWSRegistryRequest(createRegistryConfigRequest, authorId)
            is CreateGCPRegistryConfigurationRequest -> buildGCPRegistryRequest(createRegistryConfigRequest, authorId)
            is CreateDockerHubRegistryConfigurationRequest -> buildDockerHubRegistryRequest(createRegistryConfigRequest, authorId)
            is CreateHarborRegistryConfigurationRequest -> buildHarborRegistryRequest(createRegistryConfigRequest, authorId)
            else -> throw IllegalArgumentException("Provider type not supported")
        }
    }

    private fun buildAWSRegistryRequest(
        createRegistryConfigRequest: CreateAWSRegistryConfigurationRequest,
        authorId: String
    ): CreateVillagerRegistryConfigurationRequest {
        return CreateVillagerRegistryConfigurationRequest(
            name = createRegistryConfigRequest.name,
            address = createRegistryConfigRequest.address,
            provider = CreateVillagerRegistryConfigurationProvider.AWS,
            accessKey = createRegistryConfigRequest.accessKey,
            secretKey = createRegistryConfigRequest.secretKey,
            region = createRegistryConfigRequest.region,
            authorId = authorId
        )
    }

    private fun buildAzureRegistryRequest(
        createRegistryConfigRequest: CreateAzureRegistryConfigurationRequest,
        authorId: String
    ): CreateVillagerRegistryConfigurationRequest {
        return CreateVillagerRegistryConfigurationRequest(
            name = createRegistryConfigRequest.name,
            address = createRegistryConfigRequest.address,
            provider = CreateVillagerRegistryConfigurationProvider.Azure,
            username = createRegistryConfigRequest.username,
            password = createRegistryConfigRequest.password,
            authorId = authorId
        )
    }

    private fun buildGCPRegistryRequest(
        createRegistryConfigRequest: CreateGCPRegistryConfigurationRequest,
        authorId: String
    ): CreateVillagerRegistryConfigurationRequest {
        return CreateVillagerRegistryConfigurationRequest(
            name = createRegistryConfigRequest.name,
            address = createRegistryConfigRequest.address,
            provider = CreateVillagerRegistryConfigurationProvider.GCP,
            organization = createRegistryConfigRequest.organization,
            jsonKey = createRegistryConfigRequest.jsonKey,
            username = "_json_key",
            authorId = authorId
        )
    }

    private fun buildDockerHubRegistryRequest(
        createRegistryConfigRequest: CreateDockerHubRegistryConfigurationRequest,
        authorId: String
    ): CreateVillagerRegistryConfigurationRequest {
        return CreateVillagerRegistryConfigurationRequest(
            name = createRegistryConfigRequest.name,
            address = createRegistryConfigRequest.address,
            provider = CreateVillagerRegistryConfigurationProvider.DOCKER_HUB,
            organization = createRegistryConfigRequest.username,
            username = createRegistryConfigRequest.username,
            password = createRegistryConfigRequest.password,
            authorId = authorId
        )
    }

    private fun buildHarborRegistryRequest(
        createRegistryConfigRequest: CreateHarborRegistryConfigurationRequest,
        authorId: String
    ): CreateVillagerRegistryConfigurationRequest {
        return CreateVillagerRegistryConfigurationRequest(
            name = createRegistryConfigRequest.name,
            address = createRegistryConfigRequest.address,
            provider = CreateVillagerRegistryConfigurationProvider.HARBOR,
            username = createRegistryConfigRequest.username,
            password = createRegistryConfigRequest.password,
            authorId = authorId
        )
    }

    private fun buildDeployCdConfigurationRequest(
        createCdConfigRequest: CreateCdConfigurationRequest
    ): CreateDeployCdConfigurationRequest {

        return when (createCdConfigRequest) {
            is CreateSpinnakerCdConfigurationRequest -> createCdConfigRequest.toDeployRequest()
            is CreateOctopipeCdConfigurationRequest -> createCdConfigRequest.toDeployRequest()
            else -> throw IllegalArgumentException("Invalid cd configuration type")
        }
    }

    private fun getDeployCdConfigurations(workspaceId: String): List<CredentialConfigurationRepresentation> {
        val deployCdConfigurations: List<GetDeployCdConfigurationsResponse> =
            deployApi.getCdConfigurations(workspaceId)

        return deployCdConfigurations.map { configuration ->
            CredentialConfigurationRepresentation(
                configuration.id,
                configuration.name,
                userServiceLegacy.findUser(configuration.authorId).toSimpleRepresentation()
            )
        }
    }

    private fun getVillagerRegistryConfigurations(workspaceId: String): List<CredentialConfigurationRepresentation> {
        return this.villagerApi.getRegistryConfigurations(workspaceId)
            .map { configuration ->
                CredentialConfigurationRepresentation(
                    configuration.id,
                    configuration.name,
                    userServiceLegacy.findUser(configuration.authorId).toSimpleRepresentation()
                )
            }
    }

    private fun CreateGitConfigurationRequest.toEntity(workspaceId: String, author: User): CredentialConfiguration {
        return CredentialConfiguration(
            id = UUID.randomUUID().toString(),
            name = this.name,
            createdAt = LocalDateTime.now(),
            author = author,
            type = CredentialConfigurationType.GIT,
            workspaceId = workspaceId
        )
    }
}
