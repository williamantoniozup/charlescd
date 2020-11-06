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

import { stringify } from 'yaml'
import { Component, Deployment } from '../../../../../app/v2/api/deployments/interfaces'
import { ArgocdCharlesValues, ArgocdApplication } from '../../../../../app/v2/core/integrations/argocd/interfaces/argocd-application.interface'
import { applicationNameStrategy, proxyNameStrategy } from '../../../../../app/v2/core/integrations/argocd/argocd-application-name-strategy'

const createArgoApplicationFixture = (deployment: Deployment, component: Component): ArgocdApplication => {
  const values: ArgocdCharlesValues = {
    image: {
      tag: component.imageUrl
    },
    tag: component.imageTag,
    component: component.name,
    deploymentName: `${component.name}-${component.imageTag}-${deployment.circleId?.substring(24)}`,
    circleId: deployment.circleId
  }

  const helm = {
    valueFiles: [
      `${component.name}.yaml`
    ],
    values: stringify(values)
  }

  const namespace = deployment.cdConfiguration.configurationData.namespace
  const argocdApplication = new ArgocdApplication(component, namespace, deployment.circleId, helm, applicationNameStrategy)
  return argocdApplication
}

export { createArgoApplicationFixture }
