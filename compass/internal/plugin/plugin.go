/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package plugin

import (
	"bytes"
	"compass/internal/configuration"
	"compass/internal/util"
	"compass/pkg/logger"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/google/uuid"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"plugin"
	"time"
)

type Input struct {
	Name     string `json:"name"`
	Label    string `json:"label"`
	Type     string `json:"type"`
	Required bool   `json:"required"`
}

type InputParameters map[string]interface{}

type Plugin struct {
	ID              string          `json:"id"`
	Category        string          `json:"category"`
	Name            string          `json:"name"`
	Src             string          `json:"src"`
	Description     string          `json:"description"`
	InputParameters InputParameters `json:"inputParameters"`
}

type ImportRequest struct {
	Kind        string          `json:"kind"`
	RepoData    json.RawMessage `json:"repoData"`
	Credentials json.RawMessage `json:"credentials"`
}

type PluginsImportExecs struct {
	util.BaseModel
	RepoURL       string
	User          string
	ImportResults []PluginsImportsResults
}

type PluginsImportsResults struct {
	util.BaseModel
	ExecID     uuid.UUID
	PluginName string
	Result     string
}

const (
	GITHUB = "GITHUB"
	GITLAB = "GITLAB"
)

func getPluginsDirectoriesByCategory(categoryName string) ([]Plugin, error) {
	var plugins []Plugin
	pluginsDir := configuration.GetConfiguration("PLUGINS_DIR")
	ps, err := ioutil.ReadDir(fmt.Sprintf("%s/%s", pluginsDir, categoryName))
	if err != nil {
		logger.Error(util.FindPluginError, "FindAll", err, plugins)
		return []Plugin{}, err
	}

	for _, p := range ps {
		readme, err := ioutil.ReadFile(fmt.Sprintf("%s/%s/%s/readme.json", pluginsDir, categoryName, p.Name()))
		if err != nil {
			logger.Error(util.FindPluginError, "FindAll", errors.New("invalid plugin"), plugins)
			return []Plugin{}, err
		}

		newPlugin := Plugin{}
		err = json.Unmarshal(readme, &newPlugin)
		if err != nil {
			logger.Error(util.FindPluginError, "FindAll", err, plugins)
			return []Plugin{}, err
		}

		newPlugin.Src = fmt.Sprintf("%s/%s/%s", categoryName, p.Name(), p.Name())
		newPlugin.Category = categoryName
		plugins = append(plugins, newPlugin)
	}

	return plugins, err
}

func (main Main) FindAll(category string) ([]Plugin, error) {
	if category != "" {
		return getPluginsDirectoriesByCategory(category)
	}

	var plugins []Plugin
	pluginsDir := configuration.GetConfiguration("PLUGINS_DIR")

	categories, err := ioutil.ReadDir(pluginsDir)
	if err != nil {
		logger.Error(util.FindPluginError, "FindAllActions", err, plugins)
		return []Plugin{}, err
	}

	for _, category := range categories {
		if category.IsDir() {
			categoryPlugins, err := getPluginsDirectoriesByCategory(category.Name())
			if err != nil {
				return nil, err
			}

			plugins = append(plugins, categoryPlugins...)
		}
	}

	return plugins, nil
}

func (main Main) GetPluginBySrc(src string) (*plugin.Plugin, error) {
	pluginsDir := configuration.GetConfiguration("PLUGINS_DIR")
	return plugin.Open(filepath.Join(fmt.Sprintf("%s/%s.so", pluginsDir, src)))
}

func (main Main) ImportPlugin(userID string, importRequest ImportRequest) error {
	var err error
	var repoReader []byte
	switch importRequest.Kind {
	case GITHUB:
		repoReader, err = main.GithubClient.DownloadRepo(importRequest.RepoData, importRequest.Credentials)
	case GITLAB:
		repoReader, err = main.GitlabClient.DownloadRepo(importRequest.RepoData, importRequest.Credentials)
	default:
		return errors.New("invalid repository kind")
	}
	if err != nil {
		logger.Error(util.DownloadPluginError, "ImportPlugin", err, fmt.Sprintf("RepoData: %s", importRequest.RepoData))
		return err
	}

	err = writeFile(repoReader)
	if err != nil {
		return err
	}

	return nil
}

func writeFile(file []byte) error {
	now := time.Now()
	date := fmt.Sprintf("%d-%02d-%02dT%02d:%02d:%02d", now.Year(), now.Month(), now.Day(), now.Hour(), now.Minute(), now.Second())
	fileName := fmt.Sprintf("plugins-%s.tar.gz", date)

	newFile, err := os.Create(fmt.Sprintf("./tmp/%s", fileName))
	if err != nil {
		return nil
	}
	defer newFile.Close()

	_, err = io.Copy(newFile, bytes.NewReader(file))
	if err != nil {
		logger.Error(util.WritePluginFileError, "writeFile", err, nil)
		return err
	}

	return nil
}

func (main Main) ParseImportRequest(importRequest io.ReadCloser) (ImportRequest, error) {
	var req *ImportRequest

	err := json.NewDecoder(importRequest).Decode(&req)
	if err != nil {
		logger.Error(util.GeneralParseError, "ParseImportRequest", err, importRequest)
		return ImportRequest{}, err
	}

	return *req, nil

}
