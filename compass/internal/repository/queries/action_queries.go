package queries

import (
	"fmt"
	"github.com/ZupIT/charlescd/compass/internal/configuration"
	"github.com/google/uuid"
)

const ActionQuery = `SELECT id,
       					workspace_id,
       					nickname,
       					type,
       					description,
       					created_at,
						deleted_at
					FROM actions
					WHERE id = ?
					AND deleted_at IS NULL`

const WorkspaceActionQuery = `SELECT id,
       					workspace_id,
       					nickname,
       					type,
       					description,
       					created_at,
						deleted_at
					FROM actions
					WHERE workspace_id = ?
					AND deleted_at IS NULL`

func InsertAction(id, nickname, actionType, description string, config []byte, workspaceId uuid.UUID) string {
	return fmt.Sprintf(`INSERT INTO actions (id, workspace_id, nickname, type, description, configuration, deleted_at)
			VALUES ('%s', '%s', '%s', '%s', '%s', PGP_SYM_ENCRYPT('%s', '%s', 'cipher-algo=aes256'), null);`,
		id, workspaceId, nickname, actionType, description, config, configuration.Get("ENCRYPTION_KEY"))
}

func DecryptedWorkspaceAndIdActionQuery() string {
	return fmt.Sprintf(`SELECT id,
       					workspace_id,
       					nickname,
       					type,
       					description,
       					created_at,
						deleted_at,
						PGP_SYM_DECRYPT(configuration, '%s')
					FROM actions
					WHERE id = ?
					AND workspace_id = ?
					AND deleted_at IS NULL`, configuration.Get("ENCRYPTION_KEY"))
}

func IdActionQuery() string {
	return fmt.Sprintf(`SELECT id,
       					workspace_id,
       					nickname,
       					type,
       					description,
       					created_at,
						deleted_at,
						PGP_SYM_DECRYPT(configuration, '%s')
					FROM actions
					WHERE id = ?
					AND deleted_at IS NULL`, configuration.Get("ENCRYPTION_KEY"))
}