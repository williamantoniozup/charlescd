package tests

import (
	"compass/internal/plugin"
	utils "compass/internal/util"
	"os"
	"testing"

	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type SuiteDeveloper struct {
	suite.Suite

	repository plugin.UseCases
}

func (s *SuiteDeveloper) SetupSuite() {
	os.Setenv("ENV", testEnv)
	s.repository = plugin.NewMain()
}

func TestInitSuiteDeveloper(t *testing.T) {
	suite.Run(t, new(SuitePlugins))
}

func (s *Suite) TestIsDeveloperRunning() {
	require.Equal(s.T(), false, utils.IsDeveloperRunning())
}
