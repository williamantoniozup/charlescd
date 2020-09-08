package logger

import (
	"compass/internal/env"
	"time"

	"github.com/sirupsen/logrus"
)

func Info(msg string, data interface{}) {
	if env.GetConfiguration("ENV") == "TEST" {
		return
	}

	logrus.WithFields(logrus.Fields{
		"Data": data,
	}).Infoln(msg)
}

func Error(msg string, functionName string, err error, data interface{}) {
	if env.GetConfiguration("ENV") == "TEST" {
		return
	}

	logrus.WithFields(logrus.Fields{
		"Error":        err,
		"FunctionName": functionName,
		"Data":         data,
	}).WithTime(time.Now()).Errorln(msg)
}
func Panic(msg string, functionName string, err error, data interface{}) {
	if env.GetConfiguration("ENV") == "TEST" {
		return
	}

	logrus.WithFields(logrus.Fields{
		"Error":        err,
		"FunctionName": functionName,
		"Data":         data,
	}).WithTime(time.Now()).Panicln(msg)
}

func Fatal(msg string, err error) {
	logrus.Fatalln(msg, err)
}
