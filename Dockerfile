FROM node:22-alpine AS base

WORKDIR /app

# --- Build frontend ---
FROM base AS frontend-build
COPY frontend/package.json frontend/package-lock.json* ./frontend/
RUN cd frontend && npm install
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# --- Install backend & db deps ---
FROM base AS backend-deps
COPY backend/package.json backend/package-lock.json* ./backend/
COPY db/package.json db/package-lock.json* ./db/
RUN cd db && npm install && cd ../backend && npm install

# --- Production image ---
FROM base AS production

COPY db/ ./db/
COPY backend/ ./backend/
COPY --from=backend-deps /app/db/node_modules ./db/node_modules
COPY --from=backend-deps /app/backend/node_modules ./backend/node_modules
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
COPY .env.example ./.env

ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_PATH=/app/data/todo.db

RUN mkdir -p /app/data

# Run migrations then start server
CMD cd /app/db && npx tsx migrate.ts && cd /app/backend && npx tsx src/index.ts

EXPOSE 3001
