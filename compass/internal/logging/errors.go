package logging

import (
	"fmt"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"strconv"
	"time"
)

type CustomError struct {
	ID         uuid.UUID         `json:"id"`
	Message    string            `json:"message"`
	Detail     string            `json:"detail"`
	Operations []string          `json:"-"`
	Type       string            `json:"type"`
	Timestamp  string            `json:"timestamp"`
	Meta       map[string]string `json:"meta"`
}

func (customError CustomError) Error() string {
	return fmt.Sprintf("%s", customError.Detail)
}

func WithOperation(err error, operation string) error {
	customErr := err.(*CustomError)
	customErr.Operations = append(customErr.Operations, operation)

	return customErr
}

func WithMeta(err error, key, value string) error {
	customErr := err.(*CustomError)
	customErr.Meta[key] = value

	return customErr
}

func Unwrap(err error) CustomError {
	customErr, ok := err.(*CustomError)
	if !ok {
		customErr = NewError("", err, nil).(*CustomError)
	}

	return *customErr
}

func GetErrorType(err error) string {
	customError := Unwrap(err)
	return customError.Type
}

func GetErrorDetails(err error) string {
	customError := Unwrap(err)
	return customError.Detail
}

func NewError(message string, err error, meta map[string]string, operations ...string) error {
	return &CustomError{
		ID:         uuid.New(),
		Message:    message,
		Meta:       meta,
		Detail:     err.Error(),
		Operations: operations,
		Timestamp:  strconv.FormatInt(time.Now().Unix(), 10),
	}
}

func NewValidationError(validationError error, uniTranslator *ut.UniversalTranslator) error {
	errors := validationError.(validator.ValidationErrors)
	translator, _ := uniTranslator.GetTranslator("en")
	meta := make(map[string]string, 0)

	for _, validErr := range errors {
		meta[validErr.Namespace()] = validErr.Translate(translator)
	}

	return &CustomError{
		ID:        uuid.New(),
		Message:   "Invalid Inputs",
		Meta:      meta,
		Timestamp: strconv.FormatInt(time.Now().Unix(), 10),
	}
}

const (
	NotFoundError     = "NotFoundError"
	InternalError     = "InternalError"
	IllegalParamError = "IllegalParamError"
	ParseError        = "ParseError"
	BusinessError     = "BusinessError"
	ForbiddenError    = "ForbiddenError"
)