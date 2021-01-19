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

package subscription

import (
	"errors"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"hermes/internal/message"
	"hermes/internal/messageexecutionhistory"
	"hermes/internal/subscription"
	util2 "hermes/web/util"
	"net/http"
)

func Create(subscriptionMain subscription.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		request, err := subscriptionMain.ParseSubscription(r.Body)
		if err != nil {
			util2.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		author := r.Header.Get("x-author")
		if author == "" {
			util2.NewResponse(w, http.StatusInternalServerError, errors.New("author is required"))
			return
		}
		request.CreatedBy = author

		if err := subscriptionMain.Validate(request); len(err.GetErrors()) > 0 {
			util2.NewResponse(w, http.StatusBadRequest, err)
			return
		}

		createdSubscription, err := subscriptionMain.Save(request)
		if err != nil {
			util2.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util2.NewResponse(w, http.StatusCreated, createdSubscription)
	}
}

func Update(subscriptionMain subscription.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		request, err := subscriptionMain.ParseUpdate(r.Body)
		if err != nil {
			util2.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		params := mux.Vars(r)
		subscriptionId, uuidErr := uuid.Parse(params["subscriptionId"])
		if uuidErr != nil {
			util2.NewResponse(w, http.StatusInternalServerError, uuidErr)
			return
		}

		createdSubscription, err := subscriptionMain.Update(subscriptionId, request)
		if err != nil {
			util2.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util2.NewResponse(w, http.StatusOK, createdSubscription)
	}
}

func Delete(subscriptionMain subscription.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		subscriptionId, uuidErr := uuid.Parse(params["subscriptionId"])
		if uuidErr != nil {
			util2.NewResponse(w, http.StatusInternalServerError, uuidErr)
			return
		}

		author := r.Header.Get("x-author")
		if author == "" {
			util2.NewResponse(w, http.StatusInternalServerError, errors.New("author is required"))
			return
		}

		err := subscriptionMain.Delete(subscriptionId, author)
		if err != nil {
			util2.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util2.NewResponse(w, http.StatusNoContent, nil)
	}
}

func FindById(subscriptionMain subscription.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		subscriptionId, uuidErr := uuid.Parse(params["subscriptionId"])
		if uuidErr != nil {
			util2.NewResponse(w, http.StatusInternalServerError, uuidErr)
			return
		}

		result, err := subscriptionMain.FindById(subscriptionId)
		if err != nil {
			util2.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util2.NewResponse(w, http.StatusOK, result)
	}
}

func Publish(messageMain message.UseCases, executionMain messageexecutionhistory.UseCases, subscriptionMain subscription.UseCases) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		request, err := messageMain.ParsePayload(r.Body)
		if err != nil {
			util2.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		subscriptions, err := subscriptionMain.FindAllByExternalIdAndEvent(request.ExternalId, request.EventType)
		if err != nil {
			util2.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		requestMessages := subscriptionToMessageRequest(subscriptions, request)

		createdMessages, err := messageMain.Save(requestMessages)
		if err != nil {
			util2.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		requestExecutions := messageToExecutionRequest(createdMessages, request)

		publishedMessages, err := executionMain.Save(requestExecutions)
		if err != nil {
			util2.NewResponse(w, http.StatusInternalServerError, err)
			return
		}

		util2.NewResponse(w, http.StatusCreated, publishedMessages)
	}
}

func subscriptionToMessageRequest(subscriptions []subscription.ExternalIdResponse, request message.PayloadRequest) []message.Request {
	var messages []message.Request
	for _, s := range subscriptions {
		msg := message.Request{
			SubscriptionId: s.Id,
			EventType:      request.EventType,
			Event:          request.Event,
		}
		messages = append(messages, msg)
	}
	return messages
}

func messageToExecutionRequest(createdMessages []message.ExecutionResponse, request message.PayloadRequest) []messageexecutionhistory.Request {
	var requests []messageexecutionhistory.Request
	for _, m := range createdMessages {
		msg := messageexecutionhistory.Request{
			ExecutionId: m.Id,
			EventType:   request.EventType,
			Event:       request.Event,
		}
		requests = append(requests, msg)
	}
	return requests
}
