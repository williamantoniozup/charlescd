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

import { OctopipeDeployment, OctopipeDeploymentRequest } from './interfaces/octopipe-deployment.interface'
import { OctopipeUndeployment, OctopipeUndeploymentRequest } from './interfaces/octopipe-undeployment.interface'
import { CdConfiguration, Component, Deployment } from '../../../api/deployments/interfaces'
import { ConnectorConfiguration } from '../interfaces/connector-configuration.interface'
import { OctopipeConfigurationData } from '../../../../v1/api/configurations/interfaces'
import { UrlUtils } from '../../utils/url.utils'
import { HelmConfig, HelmRepositoryConfig } from './interfaces/helm-config.interface'
import { CommonTemplateUtils } from '../spinnaker/utils/common-template.utils'
import { DeploymentUtils } from '../utils/deployment.utils'
import {
  ClusterProviderEnum,
  IEKSClusterConfig,
  IGenericClusterConfig
} from '../../../../v1/core/integrations/octopipe/interfaces/octopipe-payload.interface'
import { K8sManifest } from '../interfaces/k8s-manifest.interface'
import { IstioDeploymentManifestsUtils } from '../utils/istio-deployment-manifests.utils'
import { IstioUndeploymentManifestsUtils } from '../utils/istio-undeployment-manifests.utils'
import { AppConstants } from 'src/app/v1/core/constants'
import { stringify } from 'yaml'

export class ArgoCdRequestBuilder {

  public buildDeploymentRequest(
    deployment: Deployment,
    activeComponents: Component[],
  ): unknown {

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

  private getDeploymentsArray(deployment: Deployment, activeComponents: Component[]): unknown[] {
    if (!deployment?.components) {
      return []
    }
    return deployment.components.map(component => {
      if (DeploymentUtils.getActiveSameCircleTagComponent(activeComponents, component, deployment.circleId)) {
        return
      }
      const values = `
        image:
          tag: ${component.imageUrl}
        tag: ${component.imageTag}
        component: ${component.name}
        deploymentName: ${component.name}-${component.imageTag}-${deployment.circleId}
        circleId: ${deployment.circleId}
        `
      return {
        'apiVersion': 'argoproj.io/v2alpha1',
        'kind': 'Application',
        'metadata': {
          'name': `${component.name}-${component.imageTag}-${deployment.circleId}`
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
              'values': values
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

  private getProxyArgocdJson(deployment: Deployment, activeComponents: Component[]): void {
    // TODO: add prefix option
    return deployment.components?.forEach(component => {
      const appEntries = this.getAppEntries(deployment, activeComponents)
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

  private getAppEntries(deployment: Deployment, activeComponents: Component[]): unknown {
    return deployment.components?.map(component => {
      const activeByName: Component[] = DeploymentUtils.getActiveComponentsByName(activeComponents, component.name)
      const appEntries = {
        circleProxy: [],
        defaultProxy: {},
      }
      if (!deployment.circleId) {
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
          circleId: deployment.circleId,
        })
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
      }
      return appEntries
    })
  }

  private getUndeployAppEntries(deployment: Deployment, activeComponents: Component[]): unknown {
    return deployment.components?.map(component => {
      const activeByName: Component[] = DeploymentUtils.getActiveComponentsByName(activeComponents, component.name)
      const appEntries = {
        circleProxy: [],
        defaultProxy: {},
      }
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
      
      return appEntries
    })
  }

  private getUndeploymentsArray(deployment: Deployment): string[] {
    if (!deployment?.components) {
      return []
    }
    return deployment.components.map(component => `${component.name}-${component.imageTag}-${component.deployment.circleId}`)
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
        unusedDeployments.push(`${component.name}-${component.imageTag}-${deployment.circleId}`)
      }
    })
    return unusedDeployments
  }

  private getHelmRepositoryConfig(component: Component, cdConfiguration: CdConfiguration): HelmRepositoryConfig {
    return {
      type: (cdConfiguration.configurationData as OctopipeConfigurationData).gitProvider,
      url: component.helmUrl,
      token: (cdConfiguration.configurationData as OctopipeConfigurationData).gitToken
    }
  }

  private getHelmConfig(component: Component, circleId: string | null): HelmConfig {
    return {
      overrideValues: {
        'image.tag': component.imageUrl,
        deploymentName: CommonTemplateUtils.getDeploymentName(component, circleId),
        component: component.name,
        tag: component.imageTag,
        circleId: CommonTemplateUtils.getCircleId(circleId)
      }
    }
  }

}