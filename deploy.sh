#!/bin/bash
set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Funciones de utilidad
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar requisitos
check_requirements() {
    log_info "Verificando requisitos..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker no está instalado"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose no está instalado"
        exit 1
    }
}

# Instalar Docker y Docker Compose si no están instalados
install_docker() {
    log_info "Instalando Docker y Docker Compose..."
    
    # Actualizar repositorios
    apt-get update
    
    # Instalar dependencias
    apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release

    # Añadir clave GPG oficial de Docker
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

    # Configurar repositorio estable
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
        $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Instalar Docker Engine
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

    # Iniciar y habilitar Docker
    systemctl start docker
    systemctl enable docker

    # Verificar instalación
    docker --version
    docker compose version
}

# Configurar directorios y permisos
setup_directories() {
    log_info "Configurando directorios..."
    
    # Crear directorios necesarios
    mkdir -p secrets uploads logs docker/mariadb/{conf.d,init}
    
    # Generar contraseñas seguras si no existen
    if [ ! -f secrets/db_root_password.txt ]; then
        openssl rand -base64 32 > secrets/db_root_password.txt
    fi
    
    if [ ! -f secrets/db_user.txt ]; then
        echo "innovation_user" > secrets/db_user.txt
    fi
    
    if [ ! -f secrets/db_password.txt ]; then
        openssl rand -base64 32 > secrets/db_password.txt
    fi
    
    # Configurar permisos
    chmod 600 secrets/*
    chmod 755 docker/mariadb/{conf.d,init}
}

# Desplegar aplicación
deploy_app() {
    log_info "Desplegando aplicación..."
    
    # Construir y levantar contenedores
    docker compose build --no-cache
    docker compose up -d
    
    # Verificar estado de los contenedores
    docker compose ps
    
    # Esperar a que los servicios estén saludables
    log_info "Esperando a que los servicios estén listos..."
    sleep 30
    
    # Verificar logs por errores
    docker compose logs --tail=100
}

# Función principal
main() {
    log_info "Iniciando despliegue..."
    
    # Verificar si se ejecuta como root
    if [ "$EUID" -ne 0 ]; then 
        log_error "Este script debe ejecutarse como root"
        exit 1
    }
    
    check_requirements
    install_docker
    setup_directories
    deploy_app
    
    log_info "Despliegue completado exitosamente"
}

# Ejecutar script
main