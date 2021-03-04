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

package manager

type Payload struct {
	Status       string `json:"status"`
	CallbackType string `json:"callbackType"`
}

type UseCases interface {
	ExecuteV2DeploymentPipeline(v2Pipeline V2DeploymentPipeline, incomingCircleId string)
	ExecuteV2UndeploymentPipeline(v2Pipeline V2UndeploymentPipeline, incomingCircleId string)
}

type Manager struct {
	ManagerMain
}

func (main ManagerMain) NewManager() UseCases {
	return Manager{main}
}
