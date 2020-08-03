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

package main

import (
	"log"
	"octopipe/pkg/logger"
	"octopipe/pkg/manager"
	v1 "octopipe/web/api/v1"
	"os"

	"github.com/RichardKnop/machinery/v1"
	"github.com/RichardKnop/machinery/v1/config"
	"github.com/joho/godotenv"
	"go.uber.org/zap"
)

func main() {
	zap, _ := zap.NewProduction()
	defer zap.Sync()
	sugar := zap.Sugar()

	if err := godotenv.Load(); err != nil {
		log.Fatalln("No .env file found")
	}

	config := config.Config{
		Broker:        os.Getenv("REDIS_URL"),
		ResultBackend: os.Getenv("REDIS_URL"),
	}

	server, err := machinery.NewServer(&config)
	if err != nil {
		log.Fatalln(err)
	}

	logger := logger.NewLoggerMain(sugar).NewLogger()
	managerMain := manager.NewManagerMain(logger, server)

	api := v1.NewAPI()
	api.NewPipelineAPI(managerMain)
	api.Start()
}
