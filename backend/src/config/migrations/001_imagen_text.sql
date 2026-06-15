-- Ampliar campo imagen de VARCHAR(500) a TEXT para soportar base64
ALTER TABLE productos MODIFY imagen TEXT;
