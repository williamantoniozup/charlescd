GOCMD=go
GORUN=$(GOCMD) run
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
GOTOOL=$(GOCMD) tool

DIST_PATH=dist
CMD_PROCESSOR_PATH=cmd/processor/*.go
CMD_MANAGER_PATH=cmd/manager/*.go
BINARY_PROCESSOR_NAME=octopipe-processor
BINARY_MANAGER_NAME=octopipe-manager

start-processor:
				$(GORUN) $(CMD_PROCESSOR_PATH)
start-manager:
				$(GORUN) $(CMD_MANAGER_PATH)
build-processor: 
				$(GOBUILD) -o $(DIST_PATH)/$(BINARY_PROCESSOR_NAME) $(CMD_PROCESSOR_PATH)
build-manager:
				$(GOBUILD) -o $(DIST_PATH)/$(BINARY_MANAGER_NAME) $(CMD_MANAGER_PATH)
test:
				$(GOTEST) ./...
cover:
				$(GOTEST) -coverprofile cover.out ./...
				$(GOTOOL) cover -func=cover.out
cover-browser:
				$(GOTEST) -coverprofile cover.out ./...
				$(GOTOOL) cover -html=cover.out -o cover.html