import { Component } from '../../../../v2/api/deployments/interfaces'

interface ArgocdApplicationNameStrategy {
  (component: Component, circleId: string | null): string
}

const applicationNameStrategy = (component: Component, circleId: string | null): string => {
  const MAX_NAME_SIZE = 53
  let applicationName = `${component.name}-${component.imageTag}`
  if (circleId) {
    return `${applicationName.substring(0, (MAX_NAME_SIZE - (circleId.length + 1)))}-${circleId}`
  } else {
    return applicationName.substring(0, MAX_NAME_SIZE)
  }
}

const proxyNameStrategy = (component: Component, circleId: string | null): string => {
  return component.name
}

export { ArgocdApplicationNameStrategy, applicationNameStrategy, proxyNameStrategy }