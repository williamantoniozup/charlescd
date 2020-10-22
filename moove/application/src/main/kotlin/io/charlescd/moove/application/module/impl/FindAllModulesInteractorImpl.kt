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

package io.charlescd.moove.application.module.impl

import io.charlescd.moove.application.ModuleService
import io.charlescd.moove.application.ResourcePageResponse
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.module.FindAllModulesInteractor
import io.charlescd.moove.application.module.response.ModuleResponse
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.BusinessException
import javax.inject.Named

@Named
class FindAllModulesInteractorImpl(private val moduleService: ModuleService, private val workspaceService: WorkspaceService) : FindAllModulesInteractor {

    override fun execute(
        workspaceId: String,
        name: String?,
        pageRequest: PageRequest
    ): ResourcePageResponse<ModuleResponse> {
        val workspace = workspaceService.find(workspaceId)
        validateWorkspace(workspace)
        return convert(moduleService.findByWorkspaceId(workspaceId, name, pageRequest))
    }

    private fun validateWorkspace(workspace: Workspace) {
        workspace.gitConfigurationId
            ?: throw BusinessException.of(MooveErrorCode.WORKSPACE_GIT_CONFIGURATION_IS_MISSING)
    }

    private fun convert(page: Page<Module>): ResourcePageResponse<ModuleResponse> {
        return ResourcePageResponse(
            content = page.content.map { ModuleResponse.from(it) },
            page = page.pageNumber,
            size = page.size(),
            isLast = page.isLast(),
            totalPages = page.totalPages()
        )
    }
}
