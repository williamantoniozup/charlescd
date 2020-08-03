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

package logger

type UseCases interface {
	Info(msg string, functionName string, data interface{}, keysAndValues ...interface{})
	Error(msg string, functionName string, err error, data interface{}, keysAndValues ...interface{})
}

type Logger struct {
	LoggerMain
}

func (main LoggerMain) NewLogger() UseCases {
	return Logger{main}
}

func (logger Logger) Info(msg string, functionName string, data interface{}, keysAndValues ...interface{}) {
	keysAndValues = append(keysAndValues, "functionName", functionName, "data", data)
	logger.logProvider.Infow(msg, keysAndValues...)
}

func (logger Logger) Error(msg string, functionName string, err error, data interface{}, keysAndValues ...interface{}) {
	keysAndValues = append(keysAndValues, "functionName", functionName, "err", err, "data", data)
	logger.logProvider.Errorw(msg, keysAndValues...)
}
