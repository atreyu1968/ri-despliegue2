-- Crear usuario administrador
INSERT INTO users (
  id, name, lastName, medusaCode, email, 
  phone, center, network, role
) VALUES (
  'admin-001',
  'Administrador',
  'Sistema',
  'ADMIN2024',
  'admin@redinnovacionfp.es',
  '922000000',
  'Administración Central',
  'Red Principal',
  'admin'
) ON DUPLICATE KEY UPDATE
  email = VALUES(email);

-- Configurar permisos iniciales
INSERT INTO roles (id, name, description, level)
VALUES ('admin', 'Administrador', 'Control total del sistema', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insertar datos iniciales necesarios
INSERT INTO networks (id, code, name, description)
VALUES (
  'network-001',
  'RED-PRINCIPAL',
  'Red Principal',
  'Red principal del sistema'
) ON DUPLICATE KEY UPDATE name = VALUES(name);