-- =============================================================
-- Cariñitos by Jossy — Esquema de base de datos
-- Motor: InnoDB | Charset: utf8mb4
-- =============================================================

-- -------------------------------------------------------------
-- Usuarios
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id         INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  nombre     VARCHAR(100)    NOT NULL,
  email      VARCHAR(150)    NOT NULL,
  password   VARCHAR(255)    NOT NULL,
  rol        ENUM('admin','usuario') NOT NULL DEFAULT 'usuario',
  created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  email_verificado          TINYINT(1)  NOT NULL DEFAULT 0,
  token_verificacion        VARCHAR(64) NULL,
  token_verificacion_expira DATETIME    NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_email (email),
  KEY idx_usuarios_token_verificacion (token_verificacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Categorías
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
  id     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categorias_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Productos
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
  id           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  nombre       VARCHAR(200)    NOT NULL,
  descripcion  TEXT,
  precio       DECIMAL(10,2)   NOT NULL,
  imagen       VARCHAR(500),
  categoria_id INT UNSIGNED,
  stock        INT UNSIGNED    NOT NULL DEFAULT 0,
  activo       TINYINT(1)      NOT NULL DEFAULT 1,
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_productos_categoria (categoria_id),
  INDEX idx_productos_activo    (activo),
  CONSTRAINT fk_productos_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias (id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Carrito
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS carrito (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_carrito_usuario (usuario_id),
  CONSTRAINT fk_carrito_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS carrito_items (
  id              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  carrito_id      INT UNSIGNED  NOT NULL,
  producto_id     INT UNSIGNED  NOT NULL,
  cantidad        INT UNSIGNED  NOT NULL DEFAULT 1,
  mensaje         VARCHAR(200),
  personalizacion TEXT,
  PRIMARY KEY (id),
  INDEX idx_carrito_items_carrito  (carrito_id),
  INDEX idx_carrito_items_producto (producto_id),
  CONSTRAINT fk_carrito_items_carrito
    FOREIGN KEY (carrito_id)  REFERENCES carrito   (id) ON DELETE CASCADE,
  CONSTRAINT fk_carrito_items_producto
    FOREIGN KEY (producto_id) REFERENCES productos  (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Pedidos (snapshot inmutable al momento de la compra)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedidos (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  usuario_id  INT UNSIGNED    NULL,
  -- Pedido de invitado (sin cuenta): usuario_id NULL + estos dos llenos.
  invitado_nombre   VARCHAR(100)  NULL,
  invitado_telefono VARCHAR(30)   NULL,
  tipo_envio  VARCHAR(100),
  total       DECIMAL(10,2)   NOT NULL,
  adelanto    DECIMAL(10,2)   NOT NULL,
  estado      ENUM('pendiente','en_proceso','completado','cancelado')
              NOT NULL DEFAULT 'pendiente',
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_pedidos_usuario (usuario_id),
  INDEX idx_pedidos_estado  (estado),
  CONSTRAINT fk_pedidos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pedido_items (
  id               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  pedido_id        INT UNSIGNED  NOT NULL,
  producto_id      INT UNSIGNED,
  nombre_producto  VARCHAR(200)  NOT NULL,
  precio_unitario  DECIMAL(10,2) NOT NULL,
  cantidad         INT UNSIGNED  NOT NULL DEFAULT 1,
  mensaje          VARCHAR(200),
  personalizacion  TEXT,
  PRIMARY KEY (id),
  INDEX idx_pedido_items_pedido   (pedido_id),
  INDEX idx_pedido_items_producto (producto_id),
  CONSTRAINT fk_pedido_items_pedido
    FOREIGN KEY (pedido_id)   REFERENCES pedidos   (id) ON DELETE CASCADE,
  CONSTRAINT fk_pedido_items_producto
    -- SET NULL preserva el historial si el producto se elimina
    FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Datos iniciales
-- -------------------------------------------------------------

-- Admin: a proposito no se crea aqui. Este archivo esta en el repo, asi que
-- cualquier credencial puesta en el queda publica. Crealo a mano una sola vez
-- con ADMIN_EMAIL y ADMIN_PASSWORD en el .env (que no se commitea):
--   npm run crear-admin

-- Categorías base
INSERT IGNORE INTO categorias (nombre) VALUES
  ('Navidad'),
  ('Café'),
  ('Llaveros');
