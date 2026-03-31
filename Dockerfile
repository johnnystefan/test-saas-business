# =============================================================================
# Multi-stage Dockerfile for NX monorepo NestJS services
#
# Usage:
#   docker build --build-arg APP=auth-service -t saas/auth-service .
#   docker build --build-arg APP=api-gateway  -t saas/api-gateway  .
#
# Why multi-stage?
#   Stage 1 (builder): full devDeps + NX + TypeScript — heavy, only used to compile
#   Stage 2 (runner):  only the compiled bundle + prod deps — lean final image
#
# Why build context = monorepo root?
#   NX bundles everything (libs/* included) into a single dist/apps/<APP>/main.js
#   via webpack. We only need that file + the .proto files at runtime.
#
# Why is .prisma/<client> at /app/.prisma/ and not node_modules?
#   Webpack externalizes Prisma clients with relative requires:
#     require(".prisma/auth-client")
#   Node resolves ".prisma/..." relative to the requiring file's directory.
#   Since main.js lives at /app/main.js, the client must be at /app/.prisma/.
#
# Why copy Prisma CLI + engines from builder instead of installing in runner?
#   pnpm v9+ (lockfile v9) requires an explicit `onlyBuiltDependencies` allowlist
#   in package.json to run postinstall scripts. The package.json NX generates in
#   dist/ does not have this field, so pnpm silently skips the postinstall of
#   `prisma` and `@prisma/engines` — the migration engine binary is never
#   downloaded and `prisma migrate deploy` fails at startup.
#
#   The fix: copy the already-built Prisma CLI and the already-downloaded engine
#   binaries directly from the builder stage. The builder runs `pnpm install
#   --frozen-lockfile` from the full workspace package.json (which does have the
#   allowlist), so the engines are downloaded there. We just reuse them.
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

# Build the target app — NX compiles TS + bundles libs into dist/apps/<APP>/main.js
RUN pnpm nx build ${APP} --configuration=production

# Ensure .prisma dir exists so subsequent COPY steps never fail for non-Prisma apps
RUN mkdir -p node_modules/.prisma

# -----------------------------------------------------------------------------
# Stage 2 — runner
# Lean production image: compiled bundle + prod deps + proto files
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner

ARG APP
ENV APP=${APP}
ENV NODE_ENV=production

WORKDIR /app

# Copy the compiled bundle (single file — NX webpack bundles all libs inside)
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

# 3. Prisma CLI + engines — copied from builder to avoid the pnpm v9 ignore-scripts issue.
#
#    Root cause: pnpm v9 (lockfile v9) requires an explicit `onlyBuiltDependencies`
#    allowlist in package.json to run postinstall scripts. The package.json NX generates
#    in dist/ does not have this field → pnpm silently skips @prisma/engines postinstall
#    → migration engine binary is never downloaded → `prisma migrate deploy` crashes.
#
#    Fix: copy prisma CLI and engine binary from the builder's .pnpm store where they
#    already ran. We use find to locate the versioned store paths without hardcoding them.
#    Only runs for apps with a prisma/schema.prisma (auth-service, club-service).
RUN --mount=type=bind,from=builder,source=/workspace/node_modules,target=/bm \
    PRISMA_STORE=$(find /bm/.pnpm -maxdepth 1 -name "prisma@*" -type d 2>/dev/null | head -1) && \
    ENGINES_STORE=$(find /bm/.pnpm -maxdepth 1 -name "@prisma+engines@*" -type d 2>/dev/null | head -1) && \
    if [ -n "$PRISMA_STORE" ] && [ -n "$ENGINES_STORE" ]; then \
      echo "[prisma-copy] PRISMA_STORE=$PRISMA_STORE" && \
      echo "[prisma-copy] ENGINES_STORE=$ENGINES_STORE" && \
      \
      # Get the prisma version from the store directory name (e.g. "7.6.0") \
      PRISMA_VERSION=$(echo "$PRISMA_STORE" | sed 's|.*/prisma@\([^_]*\).*|\1|') && \
      echo "[prisma-copy] installing prisma@${PRISMA_VERSION} via npm (no ignore-scripts issue)" && \
      \
      # npm install does NOT silently skip postinstall scripts — unlike pnpm v9+. \
      # This downloads the correct linux engine binary for the target arch. \
      npm install --no-save --prefix /app "prisma@${PRISMA_VERSION}" && \
      echo "[prisma-copy] done"; \
    else \
      echo "[prisma-copy] No Prisma store found — skipping (non-Prisma service)"; \
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
