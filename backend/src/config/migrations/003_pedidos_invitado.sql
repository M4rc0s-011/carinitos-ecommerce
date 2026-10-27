-- Permitir pedidos sin cuenta: usuario_id pasa a ser opcional y se guarda el
-- contacto del invitado. Un pedido tiene usuario_id O invitado_*, nunca ambos.
-- Idempotente: cada bloque solo aplica si el cambio no está hecho todavía.

SET @nullable := (SELECT IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pedidos' AND COLUMN_NAME = 'usuario_id');
SET @sql := IF(@nullable = 'NO',
  'ALTER TABLE pedidos MODIFY usuario_id INT UNSIGNED NULL',
  'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @existe := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pedidos' AND COLUMN_NAME = 'invitado_nombre');
SET @sql := IF(@existe = 0,
  'ALTER TABLE pedidos ADD COLUMN invitado_nombre VARCHAR(100) NULL AFTER usuario_id',
  'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @existe := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pedidos' AND COLUMN_NAME = 'invitado_telefono');
SET @sql := IF(@existe = 0,
  'ALTER TABLE pedidos ADD COLUMN invitado_telefono VARCHAR(30) NULL AFTER invitado_nombre',
  'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
