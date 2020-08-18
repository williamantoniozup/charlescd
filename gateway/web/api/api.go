package api

import (
	"encoding/json"
	"fmt"

	routing "github.com/qiangxue/fasthttp-routing"
)

type RestError struct {
	Message string `json:"message"`
}

func NewRestError(c *routing.Context, status int, err error) error {
	c.SetContentType("application/json")
	restError := RestError{Message: err.Error()}
	res, _ := json.Marshal(restError)
	c.SetStatusCode(status)
	fmt.Fprint(c, string(res))
	return err
}

func NewRestSuccess(c *routing.Context, status int, response interface{}) error {
	c.SetContentType("application/json")
	res, _ := json.Marshal(response)
	c.SetStatusCode(status)
	fmt.Fprint(c, string(res))
	return nil
}
