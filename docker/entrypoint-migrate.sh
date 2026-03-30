#!/bin/sh
# =============================================================================
# Docker entrypoint for services with Prisma
#
# Runs `prisma migrate deploy` before starting the NestJS app.
# This ensures the DB schema is always up-to-date on container startup.
#
# Why `migrate deploy` and not `migrate dev`?
#   - `migrate dev` is for local dev — it generates migrations and prompts interactively
#   - `migrate deploy` is for production — applies pending migrations non-interactively
#
# Why node_modules/.bin/prisma instead of npx prisma?
#   - npx tries to download from the internet if the package is not cached
#   - The Prisma CLI binary is copied from the builder stage into node_modules/.bin/
#   - This is faster, deterministic, and works in air-gapped environments
# =============================================================================
set -e

echo "[entrypoint] Running Prisma migrations..."
/app/node_modules/.bin/prisma migrate deploy --schema=/app/prisma/schema.prisma

echo "[entrypoint] Migrations complete. Starting service..."
exec node /app/main.js
