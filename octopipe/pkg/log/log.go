package log

import (
	"encoding/json"
	"octopipe/pkg/customerror"
	"reflect"
)

type Log struct {
	LogType string `json:"logType"`
	Title   string `json:"title"`
	Details string `json:"details,omitempty"`
}

type Aggregator struct {
	Logs []Log
}

func (e *Aggregator) AppendInfoLog(title string) {
	log :=  Log{
		LogType: "INFO",
		Title:   title,
	}
	e.Logs =  append(e.Logs, log)
}

func (e *Aggregator) AppendErrorLog(err error) {

	var customError customerror.Customerror
	errorBytes, _ := json.Marshal(err)
	_ = json.Unmarshal(errorBytes, &customError)
	if !reflect.DeepEqual(customError, customerror.Customerror{}) && len(customError.Detail) >  0 || len(customError.Title) > 0 {
		event := Log{
			LogType: "ERROR",
			Title:   customError.Title,
			Details: customError.Detail,
		}
		e.Logs = append(e.Logs, event)
	}

}