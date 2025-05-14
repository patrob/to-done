run_frontend:
	@echo "Running frontend..."
	@cd frontend && npm run dev

run_backend:
	@echo "Running backend..."
	@cd backend && npm run dev

up:
	@docker compose up -d

down:
	@docker compose down
