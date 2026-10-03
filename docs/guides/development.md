---
id: development
sidebar_position: 3
title: Development
---

# Development Setup

Build Sercha from source with hot-reload for the Admin UI. This uses the `examples/dev/` configuration.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Node.js](https://nodejs.org/) 20+
- [Go](https://go.dev/) 1.24+ (for running tests outside Docker)

## 1. Set up environment variables

```bash
cd sercha-core/examples/dev
cp .env.example .env
```

Generate the required secrets and add them to `.env`:

```bash
# Generate JWT_SECRET (64 hex characters)
openssl rand -hex 32

# Generate MASTER_KEY (64 hex characters)
openssl rand -hex 32
```

Edit `.env` and paste the generated values:

```
JWT_SECRET=<paste first value>
MASTER_KEY=<paste second value>
```

The remaining variables in `.env` are optional:

| Variable | Purpose |
|----------|---------|
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID ([setup guide](/connectors/github)) |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |
| `OPENAI_API_KEY` | OpenAI key for LLM features |

## 2. Start the backend

```bash
docker compose up -d --build
```

This builds the Go binary from source and starts PostgreSQL, OpenSearch, and the Sercha API on port 8080.

Wait for all services to be healthy:

```bash
docker compose ps
```

## 3. Start the Admin UI

In a separate terminal, from the repo root:

```bash
cd ui
npm install
npm run dev
```

The UI runs at [http://localhost:3000](http://localhost:3000) and connects to the backend at `localhost:8080` via the `NEXT_PUBLIC_API_URL` variable in `ui/.env.local`.

## 4. Create an admin account

Open [http://localhost:3000](http://localhost:3000) and create an admin account on the setup screen.

## Running tests

```bash
# Unit tests
go test ./...

# Integration tests (requires Docker services running)
cd tests/integration
make test
```

## Rebuilding after changes

```bash
# Rebuild backend after Go code changes
docker compose up -d --build sercha

# UI hot-reloads automatically
```

## Services

| Service | Port | Purpose |
|---------|------|---------|
| Admin UI (Next.js dev) | 3000 | Hot-reload UI |
| Sercha API | 8080 | Built from source |
| PostgreSQL | 5432 | Database |
| OpenSearch | 9200 | Legacy store, not used for search |

## Stopping

```bash
docker compose down      # preserves data
docker compose down -v   # deletes all data
```
