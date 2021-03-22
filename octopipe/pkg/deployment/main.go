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

package deployment

import (
	"github.com/argoproj/gitops-engine/pkg/utils/kube"
	"k8s.io/client-go/rest"
	"octopipe/pkg/event"
)

type MainUseCases interface {
	NewDeployment(
		action string,
		update bool,
		namespace string,
		manifest map[string]interface{},
		config *rest.Config,
		kubectl kube.Kubectl,
		event []event.Event,
	) UseCases
}

type DeploymentMain struct{}

func NewDeploymentMain() MainUseCases {
	return &DeploymentMain{}
}
