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

package repository

import (
	"fmt"
	"github.com/ZupIT/charlescd/gate/internal/configuration"
	"github.com/ZupIT/charlescd/gate/internal/domain"
	"github.com/ZupIT/charlescd/gate/internal/logging"
	"github.com/ZupIT/charlescd/gate/internal/repository/models"
	"github.com/ZupIT/charlescd/gate/internal/utils/mapper"
	"github.com/google/uuid"
	"github.com/nleof/goyesql"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type SystemTokenRepository interface {
	Create(systemToken domain.SystemToken, permissions []domain.Permission) (domain.SystemToken, error)
	FindAll(pageRequest domain.Page) ([]domain.SystemToken, domain.Page, error)
	FindById(id uuid.UUID) (domain.SystemToken, error)
	FindByToken(token string) (domain.SystemToken, error)
	Update(systemToken domain.SystemToken) error
}

type systemTokenRepository struct {
	queries goyesql.Queries
	db      *gorm.DB
}

func NewSystemTokenRepository(db *gorm.DB, queriesPath string) (SystemTokenRepository, error) {
	queries, err := goyesql.ParseFile(fmt.Sprintf("%s%s", queriesPath, "system_token_queries.sql"))
	if err != nil {
		return systemTokenRepository{}, err
	}

	return systemTokenRepository{
		queries: queries,
		db:      db,
	}, nil
}

func (systemTokenRepository systemTokenRepository) Create(systemToken domain.SystemToken, permissions []domain.Permission) (domain.SystemToken, error) {
	systemToken.ID = uuid.New()
	systemTokenToSave := mapper.SystemTokenDomainToModel(systemToken, permissions)

	if err := systemTokenRepository.db.Transaction(
		func(tx *gorm.DB) error {
			res := systemTokenRepository.db.Table("system_tokens").Create(insertSystemTokenMap(systemTokenToSave))
			if res.Error != nil {
				return res.Error
			}

			for i := range permissions {
				res = systemTokenRepository.db.Table("system_tokens_permissions").Create(insertSystemTokenPermissionsMap(systemTokenToSave.ID, permissions[i].ID))
				if res.Error != nil {
					return res.Error
				}
			}

			return nil
		}); err != nil {
		return domain.SystemToken{}, handleSystemTokenError("Save system token failed", "SystemTokenRepository.Create.Save", err, logging.InternalError)
	}

	return mapper.SystemTokenModelToDomain(systemTokenToSave), nil
}

func (systemTokenRepository systemTokenRepository) FindAll(pageRequest domain.Page) ([]domain.SystemToken, domain.Page, error) {
	var systemTokens []models.SystemToken
	var page = pageRequest

	res := systemTokenRepository.db.Where("revoked = false").
		Order(page.Sort).
		Offset(page.Offset()).
		Limit(page.PageSize).
		Preload("Permissions").
		Find(&systemTokens)
	if res.Error != nil {
		return []domain.SystemToken{}, page, handleSystemTokenError("Find all tokens failed", "SystemTokenRepository.FindAll.Find", res.Error, logging.InternalError)
	}

	res = systemTokenRepository.db.Table("system_tokens").
		Where("revoked = false").
		Count(&page.Total)
	if res.Error != nil {
		return []domain.SystemToken{}, page, handleSystemTokenError("Find all tokens failed", "SystemTokenRepository.FindAll.Count", res.Error, logging.InternalError)
	}

	return mapper.SystemTokensModelToDomains(systemTokens), page, nil
}

func (systemTokenRepository systemTokenRepository) FindById(id uuid.UUID) (domain.SystemToken, error) {
	var systemToken models.SystemToken

	res := systemTokenRepository.db.Model(models.SystemToken{}).
		Where("id = ?", id).
		Preload("Permissions").
		First(&systemToken)

	if res.Error != nil {
		if res.Error.Error() == "record not found" {
			return domain.SystemToken{}, handleSystemTokenError("Token not found", "SystemTokenRepository.FindById.First", res.Error, logging.NotFoundError)
		}
		return domain.SystemToken{}, handleSystemTokenError("Find token failed", "SystemTokenRepository.FindById.First", res.Error, logging.InternalError)
	}
	return mapper.SystemTokenModelToDomain(systemToken), nil
}

func (systemTokenRepository systemTokenRepository) FindByToken(token string) (domain.SystemToken, error) {
	var systemToken models.SystemToken

	res := systemTokenRepository.db.Raw(systemTokenRepository.queries["find-system-token-from-token"], token).First(&systemToken)

	if res.Error != nil {
		if res.Error.Error() == "record not found" {
			return domain.SystemToken{}, handleSystemTokenError("Token not found", "SystemTokenRepository.FindById.First", res.Error, logging.NotFoundError)
		}
		return domain.SystemToken{}, handleSystemTokenError("Find token failed", "SystemTokenRepository.FindById.First", res.Error, logging.InternalError)
	}

	return mapper.SystemTokenModelToDomain(systemToken), nil
}

func (systemTokenRepository systemTokenRepository) Update(systemToken domain.SystemToken) error {

	systemTokenToUpdate := mapper.SystemTokenDomainToModel(systemToken, systemToken.Permissions)

	if res := systemTokenRepository.db.Model(models.SystemToken{}).
		Where("id = ?", systemToken.ID).Updates(&systemTokenToUpdate); res.Error != nil {
		return handleSystemTokenError("Update system token failed", "SystemTokenRepository.Update.Updates", res.Error, logging.InternalError)
	}

	return nil
}

func handleSystemTokenError(message string, operation string, err error, errType string) error {
	return logging.NewError(message, err, errType, nil, operation)
}

func insertSystemTokenMap(systemToken models.SystemToken) map[string]interface{} {
	return map[string]interface{}{
		"id":         systemToken.ID,
		"name":       systemToken.Name,
		"revoked":    systemToken.Revoked,
		"workspaces": systemToken.Workspaces,
		"token": clause.Expr{
			SQL: `PGP_SYM_ENCRYPT(?,?,'cipher-algo=aes256')`,
			Vars: []interface{}{
				fmt.Sprintf("%s", systemToken.Token),
				fmt.Sprintf("%s", configuration.Get("ENCRYPTION_KEY")),
			},
		},
		"created_at":   systemToken.CreatedAt,
		"revoked_at":   systemToken.RevokedAt,
		"last_used_at": systemToken.LastUsedAt,
		"author_email": systemToken.Author,
	}
}

func insertSystemTokenPermissionsMap(systemTokenId, permissionId uuid.UUID) map[string]interface{} {
	return map[string]interface{}{
		"system_token_id": systemTokenId,
		"permission_id":   permissionId,
	}
}