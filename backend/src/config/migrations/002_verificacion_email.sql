-- Columnas de verificación de email + índice de búsqueda por token.
-- Idempotente: cada bloque solo aplica si la columna/índice no existe todavía.

SET @existe := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'email_verificado');
SET @sql := IF(@existe = 0,
  'ALTER TABLE usuarios ADD COLUMN email_verificado TINYINT(1) NOT NULL DEFAULT 0 AFTER created_at',
  'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @existe := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'token_verificacion');
SET @sql := IF(@existe = 0,
  'ALTER TABLE usuarios ADD COLUMN token_verificacion VARCHAR(64) NULL AFTER email_verificado',
  'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @existe := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'token_verificacion_expira');
SET @sql := IF(@existe = 0,
  'ALTER TABLE usuarios ADD COLUMN token_verificacion_expira DATETIME NULL AFTER token_verificacion',
  'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @existe := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND INDEX_NAME = 'idx_usuarios_token_verificacion');
SET @sql := IF(@existe = 0,
  'CREATE INDEX idx_usuarios_token_verificacion ON usuarios (token_verificacion)',
  'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
