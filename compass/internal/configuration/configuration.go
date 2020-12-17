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

package configuration

import (
	"fmt"
	"os"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	_ "github.com/lib/pq"
)

var initialValues = map[string]string{
	"DB_USER":                   "charlescd_compass",
	"DB_PASSWORD":               "compass",
	"DB_HOST":                   "localhost",
	"DB_NAME":                   "charlescd_compass",
	"DB_SSL":                    "disable",
	"DB_PORT":                   "5432",
	"PLUGINS_DIR":               "./plugins",
	"MOOVE_URL":                 "http://charlescd-moove:8080",
	"DISPATCHER_INTERVAL":       "15s",
	"MOOVE_USER":                "admin@admin",
	"MOOVE_PATH":                "http://charlescd-moove:8080",
	"MOOVE_AUTH":                "Bearer 123",
	"MOOVE_DB_USER":             "charles",
	"MOOVE_DB_PASSWORD":         "charles",
	"MOOVE_DB_HOST":             "localhost",
	"MOOVE_DB_NAME":             "charles",
	"MOOVE_DB_SSL":              "disable",
	"MOOVE_DB_PORT":             "5432",
	"REQUESTS_PER_SECOND_LIMIT": "1",
	"LIMITER_TOKEN_TTL":         "5",
	"LIMITER_HEADERS_TTL":       "5",
	"ENCRYPTION_KEY":            "caf5a807-5edd-4580-9149-7a4882755716",
	"PKEY": `
	-----BEGIN PUBLIC KEY-----
	MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlfapihqzqSZQ8Z9jGR88
	lCNdG3wcGWxLfa2E7Sr6pxx4STuhpIucA/l6FZ5OCNIzmJL+6AdVhZLovXVwIu/E
	UXYHmyOxeN3N5WB3wxRsIEB2YCUnTduJQu5oX3/hmsHBw6cX3y5SZuqy/zxZu6VE
	L33w6TK4gaGdPuitkh7hFqyIE7qc7VizMrLhWC6IqyBBipfGJwjYYkTGCW1lJj73
	eq6O5gw5agUe/NlWi7AfUUb/WBjVlD2c5SCAZgUuJtvLMkEDljY980rTj5rI52EL
	OJ9XuDbHIrDFeDgmuMAq6gFYi89RwQp98mPtisUzKkI3NzD+rFdO8iao+AK4Dplp
	XwIDAQAB
	-----END PUBLIC KEY-----
	`,
}

func GetDBConnection(migrationsPath string) (*gorm.DB, error) {
	db, err := gorm.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=%s",
		GetConfiguration("DB_HOST"),
		GetConfiguration("DB_PORT"),
		GetConfiguration("DB_USER"),
		GetConfiguration("DB_NAME"),
		GetConfiguration("DB_PASSWORD"),
		GetConfiguration("DB_SSL"),
	))
	if err != nil {
		return nil, err
	}

	driver, err := postgres.WithInstance(db.DB(), &postgres.Config{})
	if err != nil {
		return nil, err
	}

	m, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file://%s", migrationsPath),
		GetConfiguration("DB_NAME"), driver)

	if err != nil {
		return nil, err
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return nil, err
	}

	return db, err
}

func GetMooveDBConnection() (*gorm.DB, error) {
	db, err := gorm.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=%s",
		GetConfiguration("MOOVE_DB_HOST"),
		GetConfiguration("MOOVE_DB_PORT"),
		GetConfiguration("MOOVE_DB_USER"),
		GetConfiguration("MOOVE_DB_NAME"),
		GetConfiguration("MOOVE_DB_PASSWORD"),
		GetConfiguration("MOOVE_DB_SSL"),
	))
	if err != nil {
		return nil, err
	}

	return db, nil
}

func GetConfiguration(configuration string) string {
	env := os.Getenv(configuration)
	if env == "" {
		return initialValues[configuration]
	}

	return env
}
