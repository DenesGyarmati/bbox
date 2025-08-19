# ==============================
# Project Makefile
# ==============================

# Docker Compose command
DC=docker-compose

# ==============================
# Start/Stop Services
# ==============================
up:
	@echo "Starting all services..."
	$(DC) build --no-cache
	$(DC) up -d

down:
	@echo "Stopping all services..."
	$(DC) down

restart: down up
	@echo "Services restarted."

clean-build:
	@echo "Cleaning Docker builder cache..."
	docker builder prune -a -f
	docker system prune -f --volumes

# ==============================
# Laravel Commands
# ==============================
api-shell:
	@echo "Entering Laravel container..."
	$(DC) exec api bash

migrate:
	@echo "Running migrations..."
	$(DC) exec api php artisan migrate

migrate-fresh:
	@echo "Dropping and re-running migrations..."
	$(DC) exec api php artisan migrate:fresh

seed:
	@echo "Seeding database..."
	$(DC) exec api php artisan db:seed

artisan:
	@echo "Running artisan command..."
	$(DC) exec api php artisan $(cmd)

# ==============================
# Next.js Commands
# ==============================
front-shell:
	@echo "Entering Next.js container..."
	$(DC) exec front bash

npm-install:
	@echo "Installing npm dependencies in frontend..."
	$(DC) exec front npm install

npm-run:
	@echo "Running npm command in frontend..."
	$(DC) exec front npm run $(cmd)

# ==============================
# Logs
# ==============================
logs:
	@echo "Showing logs for all services..."
	$(DC) logs -f

logs-api:
	@echo "Showing Laravel API logs..."
	$(DC) logs -f api

logs-front:
	@echo "Showing frontend logs..."
	$(DC) logs -f front

logs-db:
	@echo "Showing PostgreSQL logs..."
	$(DC) logs -f db

# ==============================
# Utility
# ==============================
ps:
	$(DC) ps

generate-pgadmin-config:
	@echo "Generating servers.json with env variables..."
	@set -o allexport; \
		source .env; \
		set +o allexport; \
		envsubst < servers.json.tpl > db/servers.json

# ==============================
# Help
# ==============================
help:
	@echo "Makefile commands:"
	@echo "  up             - Build and start all containers"
	@echo "  down           - Stop all containers"
	@echo "  restart        - Restart all containers"
	@echo "  api-shell      - Open a shell inside the Laravel container"
	@echo "  migrate        - Run Laravel migrations"
	@echo "  migrate-fresh  - Drop and re-run Laravel migrations"
	@echo "  seed           - Seed the database"
	@echo "  artisan cmd=... - Run artisan command"
	@echo "  front-shell    - Open a shell inside the frontend container"
	@echo "  npm-install    - Install frontend dependencies"
	@echo "  npm-run cmd=... - Run npm script"
	@echo "  logs           - Show all logs"
	@echo "  logs-api       - Show Laravel logs"
	@echo "  logs-front     - Show frontend logs"
	@echo "  logs-db        - Show database logs"
	@echo "  ps             - Show running containers"

.PHONY: up down restart api-shell migrate migrate-fresh seed artisan front-shell npm-install npm-run logs logs-api logs-front logs-db ps help
