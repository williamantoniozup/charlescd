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

import (
	"context"
	"encoding/json"
	pipelinePKG "octopipe/pkg/pipeline"
	"octopipe/pkg/processor"
	"time"

	"github.com/RichardKnop/machinery/v1/tasks"
	log "github.com/sirupsen/logrus"
	"golang.org/x/sync/errgroup"
)

type UseCases interface {
	Start(pipeline pipelinePKG.Pipeline)
}

type Manager struct {
	ManagerMain
}

func (main ManagerMain) NewManager() UseCases {
	return Manager{main}
}

func (manager Manager) Start(pipeline pipelinePKG.Pipeline) {
	go manager.executeStages(pipeline)
}

func (manager Manager) executeStages(pipeline pipelinePKG.Pipeline) {
	var err error

	for _, stage := range pipeline.Stages {
		err = manager.executeSteps(pipeline, stage)
		if err != nil {
			break
		}
	}

	if err != nil {
		manager.pipelineOnError(pipeline)
		return
	}

	manager.pipelineOnSuccess(pipeline)
}

func (manager Manager) pipelineOnSuccess(pipeline pipelinePKG.Pipeline) {
	payload := map[string]string{
		"status": "SUCCEEDED",
	}

	manager.triggerWebhook(pipeline, payload)
}

func (manager Manager) pipelineOnError(pipeline pipelinePKG.Pipeline) {
	payload := map[string]string{
		"status": "FAILED",
	}

	manager.triggerWebhook(pipeline, payload)
}

func (manager Manager) executeSteps(pipeline pipelinePKG.Pipeline, stage []pipelinePKG.Step) error {
	errs, _ := errgroup.WithContext(context.Background())
	for _, step := range stage {
		currentStep := step
		errs.Go(func() error {
			return manager.executeStep(pipeline, currentStep)
		})
	}

	return errs.Wait()
}

func (manager Manager) executeStep(pipeline pipelinePKG.Pipeline, step pipelinePKG.Step) error {

	parsedPipeline, _ := json.Marshal(pipeline)
	parsedStep, _ := json.Marshal(step)

	getManifestsTask := tasks.Signature{
		Name: processor.TaskName,
		Args: []tasks.Arg{
			{
				Type:  "string",
				Value: string(parsedPipeline),
			},
			{
				Type:  "string",
				Value: string(parsedStep),
			},
		},
	}

	ctx := context.Background()
	asyncResult, err := manager.ManagerMain.queueClient.SendTaskWithContext(ctx, &getManifestsTask)
	if err != nil {
		return err
	}

	results, err := asyncResult.GetWithTimeout(time.Duration(time.Second*10), 1*time.Second)
	if err != nil {
		log.Println(err)
		return err
	}

	log.Println("RESULTS", results)

	return nil
}
