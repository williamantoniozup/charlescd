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

import { Component, Deployment } from '../../../api/deployments/interfaces'
import { DeploymentUtils } from '../utils/deployment.utils'
import { AppConstants } from '../../../../v1/core/constants'
import { stringify } from 'yaml'
import { ArgocdAppEntries, ArgocdApplication, ArgocdCharlesValues } from './interfaces/argocd-application.interface'
import { ArgocdDeploymentRequest } from './interfaces/argocd-deployment.interface'

const createSubstring = (applicationName: string): string => {
    return applicationName.substring(0, 53)
}

export class ArgoCdRequestBuilder {

  public buildDeploymentRequest(
    deployment: Deployment,
    activeComponents: Component[],
  ): ArgocdDeploymentRequest {

    return {
      newDeploys: this.getDeploymentsArray(deployment, activeComponents),
      deleteDeploys: this.getUnusedDeploymentsArray(deployment, activeComponents),
      proxyDeployments: this.getProxyArgocdJson(deployment, activeComponents)
    }
  }

  public buildUndeploymentRequest(
    deployment: Deployment,
    activeComponents: Component[],
  ): unknown {

    return { 
      deleteApplications: this.getUndeploymentsArray(deployment),
      proxyUndeployments: this.getProxyUndeploymentsArray(deployment, activeComponents)
    }

  }

  private getDeploymentsArray(deployment: Deployment, activeComponents: Component[]): ArgocdApplication[]{
    if (!deployment?.components) {
      return []
    }
    const applications: ArgocdApplication[] = []
    deployment.components.forEach((component: Component): ArgocdApplication | undefined=>  {
      if (DeploymentUtils.getActiveSameCircleTagComponent(activeComponents, component, deployment.circleId)) {
        return 
      }
      const values: ArgocdCharlesValues = {
        image: {
          tag: component.imageUrl
        },
        tag: component.imageTag,
        component: component.name,
        deploymentName: `${component.name}-${component.imageTag}-${deployment.circleId?.substring(24)}`,
        circleId: deployment.circleId
      }
      const argocdApplication: ArgocdApplication = {
        'apiVersion': 'argoproj.io/v2alpha1',
        'kind': 'Application',
        'metadata': {
          'name': createSubstring(`${deployment.circleId}-${component.name}-${component.imageTag}`),
          'labels': {
            'circleId': deployment.circleId,
            'imageTag': component.imageTag,
            'componentName': component.name,
          }
        },
        'spec': {
          'destination': {
            'name': '',
            'namespace': deployment.cdConfiguration.configurationData.namespace,
            'server': 'https://kubernetes.default.svc'
          },
          'source': {
            'path': component.name,
            'repoURL': component.helmUrl,
            'targetRevision': 'master',
            'helm': {
              'valueFiles': [
                `${component.name}.yaml`
              ],
              'values': stringify(values)
            }
          },
          'project': 'default',
          'syncPolicy': {
            'automated': {
              'prune': true,
              'selfHeal': false
            }
          }
        }
      }
      applications.push(argocdApplication)
    })
    return applications
  }

  private getProxyArgocdJson(deployment: Deployment, activeComponents: Component[]): ArgocdApplication[] {
    // TODO: add prefix option
    const proxys: ArgocdApplication[] = []
    deployment.components?.forEach(component => {
      const appEntries = this.getAppEntries(component, activeComponents, deployment.circleId)
      const proxyValues = {
        componentName: component.name,
        hostname:component.hostValue ? [component.hostValue, component.name] : [component.name],
        virtualGateway: component.gatewayName ? [component.gatewayName] : [],
        appEntries: appEntries.circleProxy,
        defaultVersion: appEntries.defaultProxy
      }
      const argocdProxyApplication: ArgocdApplication = {
        'apiVersion': 'argoproj.io/v2alpha1',
        'kind': 'Application',
        'metadata': {
          'name': component.name
        },
        'spec': {
          'destination': {
            'name': '',
            'namespace': deployment.cdConfiguration.configurationData.namespace,
            'server': 'https://kubernetes.default.svc'
          },
          'source': {
            'path': component.name,
            'repoURL': component.helmUrl,
            'targetRevision': 'master',
            'helm': {
              'valueFiles': [
                'values.yaml'
              ],
              'values': stringify(proxyValues),
            }
          },
          'project': 'default',
          'syncPolicy': {
            'automated': {
              'prune': true,
              'selfHeal': false
            }
          }
        }
      }
      proxys.push(argocdProxyApplication)
    })
    return proxys
  }

  private getAppEntries(component: Component, activeComponents: Component[], circleId?: string | null): ArgocdAppEntries {
    const appEntries: ArgocdAppEntries = {
      circleProxy: [],
      defaultProxy: undefined,
    }
    // deployment.components?.map(component => {
    const activeByName: Component[] = DeploymentUtils.getActiveComponentsByName(activeComponents, component.name)
    if (!circleId) {
      activeByName.map(component => appEntries.circleProxy.push({
        componentName: component.name,
        imageTag: component.imageTag,
        circleId: component.deployment?.circleId,
      }))
      appEntries.defaultProxy = {
        componentName: component.name,
        imageTag: component.imageTag,
        circleId: AppConstants.DEFAULT_CIRCLE_ID,
      }
    } else {
      appEntries.circleProxy.push({
        componentName: component.name,
        imageTag: component.imageTag,
        circleId: circleId,
      })
      activeByName.map(component => {
        const activeCircleId = component.deployment?.circleId
        if (activeCircleId && activeCircleId !== circleId) {
          appEntries.circleProxy.push({
            componentName: component.name,
            imageTag: component.imageTag,
            circleId: component.deployment?.circleId,
          })
        }
      })
      const defaultComponent: Component | undefined = activeByName.find(component => component.deployment && !component.deployment.circleId)
      if (defaultComponent) {
        appEntries.defaultProxy ={
          componentName: defaultComponent.name,
          imageTag: defaultComponent.imageTag,
          circleId: AppConstants.DEFAULT_CIRCLE_ID,
        }
      }
    }
    // })
    return appEntries
  }

  private getUndeployAppEntries(deployment: Deployment, activeComponents: Component[]): ArgocdAppEntries {
    const appEntries: ArgocdAppEntries = {
      circleProxy: [],
      defaultProxy: undefined,
    }
    if (!deployment.components?.length) {
      return appEntries
    }
    deployment.components?.map(component => {
      const activeByName: Component[] = DeploymentUtils.getActiveComponentsByName(activeComponents, component.name)

      activeByName.map(component => {
        const activeCircleId = component.deployment?.circleId
        if (activeCircleId && activeCircleId !== deployment.circleId) {
          appEntries.circleProxy.push({
            componentName: component.name,
            imageTag: component.imageTag,
            circleId: component.deployment?.circleId,
          })
        }
      })
      const defaultComponent: Component | undefined = activeByName.find(component => component.deployment && !component.deployment.circleId)
      if (defaultComponent) {
        appEntries.defaultProxy ={
          componentName: component.name,
          imageTag: component.imageTag,
          circleId: AppConstants.DEFAULT_CIRCLE_ID,
        }
      }
      
    })
    return appEntries
  }

  private getUndeploymentsArray(deployment: Deployment): string[] {
    if (!deployment?.components) {
      return []
    }
    return deployment.components.map(component => `${component.name}-${component.imageTag}-${component.deployment?.circleId}`)
  }

  private getProxyUndeploymentsArray(deployment: Deployment, activeComponents: Component[]): unknown {
    // TODO: add prefix option
    return deployment.components?.forEach(component => {
      const appEntries = this.getUndeployAppEntries(deployment, activeComponents)
      const proxyValues = {
        componentName: component.name,
        hostname:component.hostValue ? [component.hostValue, component.name] : [component.name],
        virtualGateway: component.gatewayName ? [component.gatewayName] : [],
        appEntries: appEntries.circleProxy,
        defaultVersion: appEntries.defaultProxy
      }
      return {
        'apiVersion': 'argoproj.io/v2alpha1',
        'kind': 'Application',
        'metadata': {
          'name': component.name
        },
        'spec': {
          'destination': {
            'name': '',
            'namespace': deployment.cdConfiguration.configurationData.namespace,
            'server': 'https://kubernetes.default.svc'
          },
          'source': {
            'path': component.name,
            'repoURL': component.helmUrl,
            'targetRevision': 'master',
            'helm': {
              'valueFiles': [
                'values.yaml'
              ],
              'values': stringify(proxyValues),
            }
          },
          'project': 'default',
          'syncPolicy': {
            'automated': {
              'prune': true,
              'selfHeal': false
            }
          }
        }
      }
    })

  }

  private getUnusedDeploymentsArray(deployment: Deployment, activeComponents: Component[]): string[] {
    if (!deployment?.components) {
      return []
    }
    const unusedDeployments: string[] = []
    deployment.components.forEach(component => {
      const unusedComponent: Component | undefined = DeploymentUtils.getUnusedComponent(activeComponents, component, deployment.circleId)
      if (unusedComponent) {
        unusedDeployments.push(`${unusedComponent.name}-${unusedComponent.imageTag}-${unusedComponent.deployment?.circleId}`)
      }
    })
    return unusedDeployments
  }

}