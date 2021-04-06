package handlers

import (
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	systemTokenInteractor "github.com/ZupIT/charlescd/gate/internal/use_case/system_token"
	"github.com/ZupIT/charlescd/gate/web/api/handlers/representation"
	uuidPkg "github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"net/http"
	"strconv"
)

func CreateSystemToken(createSystemToken systemTokenInteractor.CreateSystemToken) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		ctx := echoCtx.Request().Context()
		var request representation.SystemTokenRequest
		bindErr := echoCtx.Bind(&request)
		if bindErr != nil {
			logging.LogErrorFromCtx(ctx, bindErr)
			return echoCtx.JSON(http.StatusInternalServerError, logging.NewError("Cant parse body", bindErr, logging.ParseError, nil))
		}

		validationErr := echoCtx.Validate(request)
		if validationErr != nil {
			validationErr = logging.WithOperation(validationErr, "createSystemToken.InputValidation")
			logging.LogErrorFromCtx(ctx, validationErr)
			return echoCtx.JSON(http.StatusInternalServerError, validationErr)
		}

		var authorization = echoCtx.Request().Header.Get("Authorization")

		createdSystemToken, err := createSystemToken.Execute(authorization, request.RequestToInput())
		if err != nil {
			return HandleError(echoCtx, ctx, err)
		}

		return echoCtx.JSON(http.StatusCreated, representation.DomainToResponse(createdSystemToken, createdSystemToken.TokenValue))
	}
}

func GetAllSystemTokens(getAllSystemToken systemTokenInteractor.GetAllSystemToken) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {

		ctx := echoCtx.Request().Context()

		pageNumber, _ := strconv.Atoi(echoCtx.QueryParam("page"))
		pageSize, _ := strconv.Atoi(echoCtx.QueryParam("size"))
		sort := echoCtx.QueryParam("sort")

		pageRequest := domain.Page{
			PageNumber: pageNumber,
			PageSize:   pageSize,
			Sort:       sort,
		}
		pageRequest.FillDefaults()

		systemTokens, page, err := getAllSystemToken.Execute(pageRequest)
		if err != nil {
			return HandleError(echoCtx, ctx, err)
		}

		return echoCtx.JSON(http.StatusOK, representation.DomainsToPageResponse(systemTokens, page))
	}
}

func GetSystemToken(getSystemToken systemTokenInteractor.GetSystemToken) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		ctx := echoCtx.Request().Context()
		uuid, parseErr := uuidPkg.Parse(echoCtx.Param("id"))

		if parseErr != nil {
			logging.LogErrorFromCtx(ctx, parseErr)
			return echoCtx.JSON(http.StatusBadRequest, logging.NewError("Parse id failed", parseErr, logging.ParseError, nil))
		}

		systemToken, err := getSystemToken.Execute(uuid)
		if err != nil {
			return HandleError(echoCtx, ctx, err)
		}
		return echoCtx.JSON(http.StatusOK, representation.DomainToResponse(systemToken, ""))
	}
}

func RevokeSytemToken(revokeSystemToken systemTokenInteractor.RevokeSystemToken) echo.HandlerFunc {
	return func(echoCtx echo.Context) error {
		ctx := echoCtx.Request().Context()
		uuid, parseErr := uuidPkg.Parse(echoCtx.Param("id"))

		if parseErr != nil {
			logging.LogErrorFromCtx(ctx, parseErr)
			return echoCtx.JSON(http.StatusBadRequest, logging.NewError("Parse id failed", parseErr, logging.ParseError, nil))
		}

		err := revokeSystemToken.Execute(uuid)

		if err != nil {
			return HandleError(echoCtx, ctx, err)
		}

		return echoCtx.JSON(http.StatusNoContent, nil)
	}
}
