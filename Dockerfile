# =============================================================================
# Multi-stage Dockerfile for NX monorepo NestJS services
#
# Usage:
#   docker build --build-arg APP=auth-service -t saas/auth-service .
#   docker build --build-arg APP=api-gateway  -t saas/api-gateway  .
#
# Why multi-stage?
#   Stage 1 (builder): full devDeps + NX + TypeScript — heavy, only used to compile
#   Stage 2 (runner):  compiled bundle + prod node_modules + proto files — lean image
#
# Why build context = monorepo root?
#   NX webpack references all libs from the monorepo root. The build must run
#   from the workspace root so NX can resolve all imports.
#
# Why copy node_modules from builder instead of re-running pnpm install?
#   NX generates a dist/apps/<APP>/package.json with only the runtime dependencies.
#   We use that file + pnpm install --prod to get a minimal node_modules for the runner.
#   pnpm is used in the runner stage too, but only for prod deps (no devDeps).
#
# Why is .prisma/<client> at /app/.prisma/ and not node_modules?
#   Webpack externalizes Prisma clients with relative requires:
#     require(".prisma/auth-client")
#   Node resolves ".prisma/..." relative to the requiring file's directory.
#   Since main.js lives at /app/main.js, the client must be at /app/.prisma/.
#
# Why use npm (not pnpm) to install the Prisma CLI in the runner?
#   pnpm v9+ requires an explicit `onlyBuiltDependencies` allowlist in package.json
#   to run postinstall scripts. The dist/ package.json NX generates does not have
#   this field → pnpm skips @prisma/engines postinstall → migration engine binary
#   is never downloaded → `prisma migrate deploy` crashes at startup.
#   npm does NOT have this issue.
# =============================================================================

ARG APP
ARG NODE_VERSION=22-alpine

# -----------------------------------------------------------------------------
# Stage 1 — builder
# Installs ALL dependencies and runs `nx build <APP>`
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS builder

# Build argument must be redeclared after FROM
ARG APP

WORKDIR /workspace

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency manifests first (layer cache — only invalidated on dep changes)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all app/lib package.json files so pnpm workspace resolution works
COPY apps/*/package.json* ./apps/
COPY libs/*/package.json* ./libs/

# Install all dependencies (including devDeps needed for the build)
# pnpm runs postinstall scripts here because the root package.json has the full
# workspace allowlist — @prisma/engines downloads its linux binaries at this step.
RUN pnpm install --frozen-lockfile

# Copy the full source
COPY . .

# Generate Prisma client if the app has a schema.
# Prisma 7: datasource URL lives in prisma.config.ts, not schema.prisma.
# We pass a dummy URL via env var — generate only needs the schema for TS types,
# it does NOT connect to the database at build time.
RUN if [ -f "apps/${APP}/prisma/schema.prisma" ]; then \
      DATABASE_URL="postgresql://x:x@localhost:5432/x" \
      pnpm prisma generate --config="apps/${APP}/prisma.config.ts"; \
    fi

# Build the target app — NX compiles TS + bundles into dist/apps/<APP>/main.js
# generatePackageJson: true in webpack.config.js emits dist/apps/<APP>/package.json
# with only the runtime (non-bundled) dependencies.
RUN pnpm nx build ${APP} --configuration=production

# Ensure .prisma dir exists so subsequent COPY steps never fail for non-Prisma apps
RUN mkdir -p node_modules/.prisma

# -----------------------------------------------------------------------------
# Stage 2 — runner
# Lean production image: compiled bundle + prod node_modules + proto files
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner

ARG APP
ENV APP=${APP}
ENV NODE_ENV=production

WORKDIR /app

# Install pnpm (needed to install prod deps from the generated package.json)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy the generated package.json (lists only runtime deps, no devDeps)
# and install production node_modules in the runner.
# We do NOT copy pnpm-lock.yaml because the generated package.json uses exact
# versions already — no lock file needed.
COPY --from=builder /workspace/dist/apps/${APP}/package.json ./package.json

# Install prod deps. pnpm respects the full workspace allowlist here because
# we're running from the runner's own package.json (not the generated dist one).
# Note: for Prisma services we install the CLI separately via npm (see below).
RUN pnpm install --prod --no-lockfile --ignore-scripts 2>&1 | tail -5 || true

# Copy the compiled bundle (main.js has all internal libs bundled by webpack)
COPY --from=builder /workspace/dist/apps/${APP}/main.js ./main.js

# Copy .proto files — gRPC loads them at runtime via protoPath
# GRPC_PROTO_DIR env var points here: /app/libs/grpc/protos
COPY --from=builder /workspace/libs/grpc/protos ./libs/grpc/protos

# ---------------------------------------------------------------------------
# Prisma artifacts — only for services with a schema (auth-service, club-service)
# ---------------------------------------------------------------------------

# 1. Prisma generated client
#    Webpack externalizes require(".prisma/auth-client") relative to main.js,
#    so the client must live at /app/.prisma/<name>-client.
RUN --mount=type=bind,from=builder,source=/workspace/node_modules/.prisma,target=/prisma-clients \
    CLIENT_NAME=$(echo "${APP}" | sed 's/-service$//') && \
    if [ -d "/prisma-clients/${CLIENT_NAME}-client" ]; then \
      mkdir -p /app/.prisma && \
      cp -r "/prisma-clients/${CLIENT_NAME}-client" "/app/.prisma/${CLIENT_NAME}-client"; \
    fi

# 2. Prisma migration files + config
#    entrypoint-migrate.sh runs `prisma migrate deploy --config=/app/prisma.config.ts`
#    The config must be at /app/prisma.config.ts (CWD of the runner process).
#    schema and migrations paths inside the config are relative to /app.
RUN --mount=type=bind,from=builder,source=/workspace,target=/src \
    if [ -d "/src/apps/${APP}/prisma" ]; then \
      cp -r "/src/apps/${APP}/prisma" /app/prisma; \
      cp "/src/apps/${APP}/prisma.config.ts" /app/prisma.config.ts; \
    fi

# 3. Prisma CLI + engines — only for services with a schema (auth, club).
#
#    pnpm v9 silently skips @prisma/engines postinstall (no onlyBuiltDependencies
#    in the generated package.json) → migration engine binary is never downloaded.
#    npm does NOT have this issue — it runs postinstall unconditionally.
#    Guard: skip entirely for non-Prisma services (booking, finance, inventory, api-gateway).
RUN --mount=type=bind,from=builder,source=/workspace/node_modules,target=/bm \
    if [ -f "/app/prisma/schema.prisma" ]; then \
      PRISMA_STORE=$(find /bm/.pnpm -maxdepth 1 -name "prisma@*" -type d 2>/dev/null | head -1) && \
      PRISMA_VERSION=$(echo "$PRISMA_STORE" | sed 's|.*/prisma@\([^_]*\).*|\1|') && \
      echo "[prisma-copy] installing prisma@${PRISMA_VERSION} via npm" && \
      npm install --no-save --prefix /app "prisma@${PRISMA_VERSION}" && \
      echo "[prisma-copy] done"; \
    else \
      echo "[prisma-copy] No schema found — skipping prisma install (non-Prisma service)"; \
    fi

# ---------------------------------------------------------------------------

# Copy docker scripts (entrypoint for services with Prisma migrations)
COPY docker/entrypoint-migrate.sh /app/docker/entrypoint-migrate.sh
RUN chmod +x /app/docker/entrypoint-migrate.sh

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs && \
    chown -R nestjs:nodejs /app
USER nestjs

# Health check — all services expose GET /health on their HTTP port
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-3000}/health || exit 1

CMD ["node", "main.js"]
