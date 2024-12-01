-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS innovation_network;
USE innovation_network;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  medusaCode VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  center VARCHAR(100) NOT NULL,
  network VARCHAR(50) NOT NULL,
  role ENUM('admin', 'general_coordinator', 'subnet_coordinator', 'manager') NOT NULL,
  imageUrl TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_medusa (medusaCode),
  INDEX idx_network (network),
  INDEX idx_center (center)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de redes
CREATE TABLE IF NOT EXISTS networks (
  id VARCHAR(36) PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  headquarterId VARCHAR(36),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  FOREIGN KEY (headquarterId) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de centros asociados a redes
CREATE TABLE IF NOT EXISTS network_centers (
  networkId VARCHAR(36) NOT NULL,
  centerId VARCHAR(36) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (networkId, centerId),
  FOREIGN KEY (networkId) REFERENCES networks(id) ON DELETE CASCADE,
  FOREIGN KEY (centerId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de acciones
CREATE TABLE IF NOT EXISTS actions (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  studentParticipants INT NOT NULL DEFAULT 0,
  teacherParticipants INT NOT NULL DEFAULT 0,
  rating INT NOT NULL DEFAULT 5,
  comments TEXT,
  createdBy VARCHAR(36) NOT NULL,
  network VARCHAR(50) NOT NULL,
  center VARCHAR(100) NOT NULL,
  quarter VARCHAR(36) NOT NULL,
  imageUrl TEXT,
  documentUrl TEXT,
  documentName VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_network (network),
  INDEX idx_center (center),
  INDEX idx_quarter (quarter),
  INDEX idx_dates (startDate, endDate),
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de departamentos participantes en acciones
CREATE TABLE IF NOT EXISTS action_departments (
  actionId VARCHAR(36) NOT NULL,
  departmentCode VARCHAR(50) NOT NULL,
  PRIMARY KEY (actionId, departmentCode),
  FOREIGN KEY (actionId) REFERENCES actions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de familias profesionales participantes en acciones
CREATE TABLE IF NOT EXISTS action_families (
  actionId VARCHAR(36) NOT NULL,
  familyCode VARCHAR(50) NOT NULL,
  PRIMARY KEY (actionId, familyCode),
  FOREIGN KEY (actionId) REFERENCES actions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de grupos participantes en acciones
CREATE TABLE IF NOT EXISTS action_groups (
  actionId VARCHAR(36) NOT NULL,
  groupId VARCHAR(36) NOT NULL,
  PRIMARY KEY (actionId, groupId),
  FOREIGN KEY (actionId) REFERENCES actions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de objetivos asociados a acciones
CREATE TABLE IF NOT EXISTS action_objectives (
  actionId VARCHAR(36) NOT NULL,
  objectiveId VARCHAR(36) NOT NULL,
  PRIMARY KEY (actionId, objectiveId),
  FOREIGN KEY (actionId) REFERENCES actions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de cursos académicos
CREATE TABLE IF NOT EXISTS academic_years (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  isActive BOOLEAN NOT NULL DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_dates (startDate, endDate),
  INDEX idx_active (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de trimestres
CREATE TABLE IF NOT EXISTS quarters (
  id VARCHAR(36) PRIMARY KEY,
  academicYearId VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  isActive BOOLEAN NOT NULL DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (academicYearId) REFERENCES academic_years(id) ON DELETE CASCADE,
  INDEX idx_dates (startDate, endDate),
  INDEX idx_active (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;