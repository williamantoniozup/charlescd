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

package processor

import (
	"encoding/json"
	pipelinePKG "octopipe/pkg/pipeline"
)

const (
	TaskName   = "PROCESS_STEP"
	WorkerName = "OCTOPIPE_WORKER"
)

type UseCases interface {
	Process(pipeline, step string) error
}

type Processor struct {
	ProcessorMain
}

func (main ProcessorMain) NewProcessor() UseCases {
	return Processor{main}
}

func (processor Processor) Process(pipeline, step string) error {
	var newPipeline pipelinePKG.Pipeline
	var newStep pipelinePKG.Step
	_ = json.Unmarshal([]byte(pipeline), &newPipeline)
	_ = json.Unmarshal([]byte(step), &newStep)

	processor.loggerMain.Info("PROCESS:GET_MANIFESTS", "Process", newStep)
	manifests, err := processor.getManifestsbyTemplate(newPipeline.Name, newStep)
	if err != nil {
		processor.loggerMain.Error("PROCESS:GET_MANIFESTS_FAILED", "Process", err, newStep)
		return err
	}

	if err := processor.executeManifests(newPipeline, newStep, manifests); err != nil {
		processor.loggerMain.Error("PROCESS:EXECUTE_MANIFESTS", "Process", err, newStep)
		return err
	}

	return nil
}

func (processor Processor) getManifestsbyTemplate(name string, step pipelinePKG.Step) (map[string]interface{}, error) {
	templateContent, valueContent, err := processor.getFilesFromRepository(name, step)
	if err != nil {
		return nil, err
	}

	template, err := processor.templateMain.NewTemplate(step.Template)
	if err != nil {
		return nil, err
	}

	manifests, err := template.GetManifests(templateContent, valueContent)
	if err != nil {
		return nil, err
	}

	return manifests, nil
}

func (processor Processor) getFilesFromRepository(name string, step pipelinePKG.Step) (string, string, error) {
	repository, err := processor.repositoryMain.NewRepository(step.Repository)
	if err != nil {
		return "", "", err
	}

	processor.loggerMain.Info("PROCESS:START_GET_TEMPLATE_AND_VALUE", "Process", step)
	templateContent, valueContent, err := repository.GetTemplateAndValueByName(name)
	if err != nil {
		return "", "", err
	}

	return templateContent, valueContent, nil
}

func (processor Processor) executeManifests(pipeline pipelinePKG.Pipeline, step pipelinePKG.Step, manifests map[string]interface{}) error {
	for _, manifest := range manifests {
		err := processor.executeManifest(pipeline, step, manifest.(map[string]interface{}))
		if err != nil {
			return err
		}
	}

	return nil
}

func (processor Processor) executeManifest(pipeline pipelinePKG.Pipeline, step pipelinePKG.Step, manifest map[string]interface{}) error {
	cloudprovider := processor.cloudproviderMain.NewCloudProvider(pipeline.Config)
	config, err := cloudprovider.GetClient()
	if err != nil {
		return err
	}

	deployment := processor.deploymentMain.NewDeployment(
		step.Action,
		step.Update,
		pipeline.Namespace,
		manifest,
		config,
	)
	if err != nil {
		return err
	}

	if err := deployment.Do(); err != nil {
		return err
	}

	return nil
}
