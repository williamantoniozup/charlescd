package v1

import (
	"log"

	routing "github.com/qiangxue/fasthttp-routing"
	"github.com/valyala/fasthttp"
)

type UseCases interface{}

type ApiV1 struct {
	router *routing.Router
}

func NewApiV1() ApiV1 {
	router := routing.New()

	return ApiV1{router}
}

func (v1 *ApiV1) Start() {
	log.Println("Starting manager api on 8080...")
	log.Fatal(fasthttp.ListenAndServe(":8080", v1.router.HandleRequest))
}
