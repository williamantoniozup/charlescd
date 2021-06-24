// Code generated by mockery v0.0.0-dev. DO NOT EDIT.

package metrics_group

import (
	domain "github.com/ZupIT/charlescd/compass/internal/domain"

	mock "github.com/stretchr/testify/mock"
)

// CreateMetricsGroup is an autogenerated mock type for the CreateMetricsGroup type
type CreateMetricsGroup struct {
	mock.Mock
}

// Execute provides a mock function with given fields: metricsGroup
func (_m *CreateMetricsGroup) Execute(metricsGroup domain.MetricsGroup) (domain.MetricsGroup, error) {
	ret := _m.Called(metricsGroup)

	var r0 domain.MetricsGroup
	if rf, ok := ret.Get(0).(func(domain.MetricsGroup) domain.MetricsGroup); ok {
		r0 = rf(metricsGroup)
	} else {
		r0 = ret.Get(0).(domain.MetricsGroup)
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(domain.MetricsGroup) error); ok {
		r1 = rf(metricsGroup)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}