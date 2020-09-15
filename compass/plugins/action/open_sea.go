package main

import (
	"bytes"
	"compass/pkg/action"
	"encoding/json"
	"net/http"
)

type OpenSeaConfiguration struct {
	action.BaseActionConfiguration
	ButlerUrl string `json:"butlerUrl"`
}

func parseConfiguration(configurationRaw []byte) (OpenSeaConfiguration, error) {
	openSeaConfiguration := OpenSeaConfiguration{}
	err := json.Unmarshal(configurationRaw, &openSeaConfiguration)
	if err != nil {
		return OpenSeaConfiguration{}, err
	}

	return openSeaConfiguration, nil
}

func Do(configurationRaw []byte) error {
	openSeaConfiguration, err := parseConfiguration(configurationRaw)
	if err != nil {
		return err
	}

	reqBody, err := json.Marshal(map[string]string{})

	req, err := http.NewRequest("POST", openSeaConfiguration.ButlerUrl, bytes.NewBuffer(reqBody))
	if err != nil {
		return err
	}

	client := &http.Client{}
	_, err = client.Do(req)
	if err != nil {
		return err
	}

	return nil
}
