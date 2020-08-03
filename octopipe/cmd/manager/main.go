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
	"octopipe/pkg/manager"
	v1 "octopipe/web/api/v1"

	"github.com/RichardKnop/machinery/v1"
	"github.com/RichardKnop/machinery/v1/config"
	"github.com/joho/godotenv"
)

func main() {

	config := config.Config{
		Broker:        "redis://root:octopipe@127.0.0.1:6379",
		ResultBackend: "redis://root:octopipe@127.0.0.1:6379",
	}

	if err := godotenv.Load(); err != nil {
		log.Fatalln("No .env file found")
	}

	server, err := machinery.NewServer(&config)
	if err != nil {
		log.Fatalln(err)
	}

	managerMain := manager.NewManagerMain(server)

	api := v1.NewAPI()
	api.NewPipelineAPI(managerMain)
	api.Start()
}
