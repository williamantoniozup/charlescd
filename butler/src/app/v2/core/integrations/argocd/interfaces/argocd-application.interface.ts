import { Component } from '../../../../api/deployments/interfaces'
import { ArgocdApplicationNameStrategy } from '../argocd-application-name-strategy'

interface ArgocdLabels {
    circleId?: string | null
    imageTag: string
    componentName: string
}
interface ArgocdMetadata {
    name: string
    labels?: ArgocdLabels
}

interface ArgocdDestination {
    name: string
    namespace: string
    server: string
}

export interface ArgocdHelm {
    valueFiles: string[]
    values: string
}

interface ArgocdSyncPolicyAutomated {
    prune: boolean
    selfHeal: boolean
}

interface ArgocdSyncPolicy {
    automated: ArgocdSyncPolicyAutomated
}

interface ArgocdSpec {
    destination: ArgocdDestination
    source: ArgocdSource
    project: string,
    syncPolicy: ArgocdSyncPolicy
}

interface ArgocdSource {
    path: string
    repoURL: string
    targetRevision: string
    helm: ArgocdHelm
}

export class ArgocdApplication {
  
    apiVersion: string
    kind: string
    metadata: ArgocdMetadata
    spec: ArgocdSpec

    constructor(private component: Component, 
                private namespace: string, 
                private circleId: string | null,
                private helm: ArgocdHelm,
                private nameStrategy: ArgocdApplicationNameStrategy) {
      this.apiVersion = 'argoproj.io/v2alpha1'
      this.kind = 'Application',
      this.metadata = this.createMetadata()
      this.spec = this.createSpec()
    }
    
    private createMetadata(): ArgocdMetadata {
      return {
        name: this.nameStrategy(this.component, this.circleId),
        labels: {
          circleId: this.circleId,
          imageTag: this.component.imageTag,
          componentName: this.component.name,
        }
      }
    }

    private createSpec(): ArgocdSpec {
      return {
        destination: {
          name: '',
          namespace: this.namespace,
          server: 'https://kubernetes.default.svc' // TODO: mudar
        },
        source: {
          path: this.component.name,
          repoURL: this.component.helmUrl,
          targetRevision: 'master', // TODO: mudar?
          helm: this.helm
        },
        project: 'default', // TODO: mudar
        syncPolicy: {
          automated: {
            prune: true,
            selfHeal: false
          }
        }
      }
    }
}

interface ArgocdCharlesValuesImage {
    tag: string
}

export interface ArgocdCharlesValues {
    image: ArgocdCharlesValuesImage
    tag: string
    component: string
    deploymentName: string
    circleId: string | null
}

interface ArgocdAppEntry {
    componentName: string
    imageTag: string
    circleId: string | undefined | null
}

export interface ArgocdAppEntries {
    circleProxy: ArgocdAppEntry[]
    defaultProxy: ArgocdAppEntry | undefined
}