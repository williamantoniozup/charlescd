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

interface ArgocdHelm {
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


export interface ArgocdApplication {
    apiVersion: string
    kind: string,
    metadata: ArgocdMetadata
    spec: ArgocdSpec
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