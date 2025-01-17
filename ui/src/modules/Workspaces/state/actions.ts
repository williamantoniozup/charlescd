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

import { FetchStatuses } from 'core/providers/base/hooks';
import { WorkspacePagination } from '../interfaces/WorkspacePagination';
import { Workspace } from '../interfaces/Workspace';

export enum ACTION_TYPES {
  loadedWorkspaces = 'WORKSPACES/LOADED_WORKSPACES',
  loadedWorkspace = 'WORKSPACES/LOADED_WORKSPACE',
  statusWorkspace = 'WORKSPACES/STATUS',
  resetContent = 'WORKSPACES/RESET_CONTENT',
  loadedWorkspacePermissions = 'WORKSPACES/LOADED_WORKSPACE_PERMISSIONS'
}

interface LoadedWorkspacesActionType {
  type: typeof ACTION_TYPES.loadedWorkspaces;
  payload: WorkspacePagination;
}

interface LoadedWorkspaceActionType {
  type: typeof ACTION_TYPES.loadedWorkspace;
  payload: Workspace;
}

interface StatusWorkspaceActionType {
  type: typeof ACTION_TYPES.statusWorkspace;
  payload: FetchStatuses;
}

interface LoadedWorkspacePermissionActionType {
  type: typeof ACTION_TYPES.loadedWorkspacePermissions;
  payload: string[];
}

interface ResetContentActionType {
  type: typeof ACTION_TYPES.resetContent;
}

export const loadedWorkspacesAction = (
  payload: WorkspacePagination
): WorkspacesActionTypes => ({
  type: ACTION_TYPES.loadedWorkspaces,
  payload
});

export const loadedWorkspaceAction = (
  payload: Workspace
): WorkspacesActionTypes => ({
  type: ACTION_TYPES.loadedWorkspace,
  payload
});

export const loadedWorkspacePermissionsAction = (
  payload: string[]
): LoadedWorkspacePermissionActionType => ({
  type: ACTION_TYPES.loadedWorkspacePermissions,
  payload
});

export const statusWorkspaceAction = (
  payload: FetchStatuses
): WorkspacesActionTypes => ({
  type: ACTION_TYPES.statusWorkspace,
  payload
});

export const resetContentAction = (): ResetContentActionType => ({
  type: ACTION_TYPES.resetContent
});

export type WorkspacesActionTypes =
  | LoadedWorkspacesActionType
  | LoadedWorkspaceActionType
  | StatusWorkspaceActionType
  | ResetContentActionType
  | LoadedWorkspacePermissionActionType;
