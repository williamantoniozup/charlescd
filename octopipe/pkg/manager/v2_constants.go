package manager

import (
	"octopipe/pkg/cloudprovider"
	"octopipe/pkg/repository"
	"octopipe/pkg/template/helm"
)

type V2CallbackData struct {
	Type	string `json:"type"`
	Status	string `json:"status"`
}

const (
	DEPLOYMENT_CALLBACK = "DEPLOYMENT"
	UNDEPLOYMENT_CALLBACK = "UNDEPLOYMENT"
	SUCCEEDED_STATUS = "SUCCEEDED"
	FAILED_STATUS = "FAILED"
	DEPLOY_ACTION = "DEPLOY"
	UNDEPLOY_ACTION = "UNDEPLOY"
)

type ProxyDeployment struct {
	VirtualServiceManifests  []map[string]interface{} `json:"virtualServiceManifests"`
	DestinationRulesManifests  []map[string]interface{} `json:"destinationRulesManifests"`
}
type V2Deployment struct {
	ComponentName		 string					`json:"componentName"`
	HelmRepositoryConfig repository.Repository  `json:"helmRepositoryConfig"`
	HelmConfig   	     helm.HelmTemplate		`json:"helmConfig"`
	RollbackIfFailed	 bool					`json:"rollbackIfFailed"`
}



type V2DeploymentPipeline struct {
	Namespace 		 		string						`json:"namespace"`
	Deployments 	 		[]V2Deployment				`json:"deployments"`
	UnusedDeployments 		[]V2Deployment				`json:"unusedDeployments"`
	ProxyDeployments 		ProxyDeployment    `json:"proxyDeployments"`
	UnusedProxyDeployments 	ProxyDeployment    `json:"unusedProxyDeployments"`
	CallbackUrl   			string           			`json:"callbackUrl"`
	ClusterConfig    		cloudprovider.Cloudprovider `json:"clusterConfig"`
}

type V2UndeploymentPipeline struct {
	Namespace 		 	           string						`json:"namespace"`
	Undeployments 	 	           []V2Deployment				`json:"undeployments"`
	ProxyDeployment 	           ProxyDeployment    			`json:"proxyDeployment"`
	CallbackUrl   		           string           			`json:"callbackUrl"`
	ClusterConfig    	           cloudprovider.Cloudprovider `json:"clusterConfig"`
}
