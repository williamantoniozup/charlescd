package log

import (
	"encoding/json"
	"octopipe/pkg/customerror"
	"reflect"
	"time"
)

type Log struct {
	Type    string `json:"type"`
	Title   string `json:"title"`
	Details string `json:"details,omitempty"`
	TimeStamp string `json:"timestamp"`
}

type Aggregator struct {
	Logs []Log
}

func (e *Aggregator) AppendInfoLog(title string) {
	log :=  Log{
		Type: "INFO",
		Title:   title,
		TimeStamp: time.Now().String(),
	}
	e.Logs =  append(e.Logs, log)
}

func (e *Aggregator) AppendErrorLog(err error) {

	var customError customerror.Customerror
	errorBytes, _ := json.Marshal(err)
	_ = json.Unmarshal(errorBytes, &customError)
	if !reflect.DeepEqual(customError, customerror.Customerror{}) && len(customError.Detail) >  0 || len(customError.Title) > 0 {
		event := Log{
			Type: "ERROR",
			Title:   customError.Title,
			Details: customError.Detail,
			TimeStamp: time.Now().String(),
		}
		e.Logs = append(e.Logs, event)
	}

}