package event

import (
	"encoding/json"
	"octopipe/pkg/customerror"
	"reflect"
)

type Event struct {
	EventType string `json:"eventType"`
	Title string	`json:"title"`
	Details string	`json:"details,omitempty"`
}

type EventAgregator struct {
	Events []Event
}

func (e *EventAgregator) AppendInfoEvent(title string) {
	event :=  Event{
		EventType: "INFO",
		Title:      title,
	}
	e.Events =  append(e.Events, event)
}

func (e *EventAgregator) AppendErrorEvent(err error) {

	var customError customerror.Customerror
	errorBytes, _ := json.Marshal(err)
	_ = json.Unmarshal(errorBytes, &customError)
	if !reflect.DeepEqual(customError, customerror.Customerror{}) && len(customError.Detail) >  0 || len(customError.Title) > 0 {
		event := Event{
			EventType: "ERROR",
			Title: customError.Title,
			Details: customError.Detail,
		}
		e.Events = append(e.Events, event)
	}

}