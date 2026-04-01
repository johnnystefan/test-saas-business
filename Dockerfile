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
# Why is .prisma/<client> at /app/node_modules/.prisma/ and not /app/.prisma/?
#   Webpack externalizes Prisma clients as bare module specifiers:
#     require(".prisma/auth-client")   ← starts with "." but no "/"
#   Node.js does NOT treat this as a relative path — it does module resolution,
#   walking up looking for node_modules/.prisma/auth-client.
#   Since main.js lives at /app/main.js, the client must be at
#   /app/node_modules/.prisma/auth-client (node_modules resolution path).
#
# Why use npm (not pnpm) to install the Prisma CLI + client in the runner?
#   pnpm uses a virtual store (.pnpm/) with symlinks. Transitive dependencies like
#   @prisma/client-runtime-utils are NOT hoisted to node_modules/@prisma/ — they live
#   inside .pnpm/@prisma+client@x.x.x/node_modules/@prisma/. The generated Prisma
#   client (.prisma/<name>-client/runtime/client.js) does require('@prisma/client-runtime-utils')
#   which Node resolves upward from .prisma/, hitting node_modules/@prisma/ — but pnpm
#   never puts it there. npm flattens everything into node_modules, so the require works.
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

# Allow pnpm to run @prisma/engines postinstall (downloads linux-musl binaries).
# The NX-generated package.json lacks onlyBuiltDependencies so pnpm v9+ skips
# postinstall scripts. We patch it in-place with python3 before installing.
RUN if python3 -c "import json,sys; d=json.load(open('package.json')); \
      deps=list(d.get('dependencies',{}).keys()); \
      prisma_pkgs=[p for p in deps if 'prisma' in p.lower()]; \
      d.setdefault('pnpm',{})['onlyBuiltDependencies']=prisma_pkgs or ['@prisma/engines']; \
      json.dump(d,open('package.json','w'),indent=2)" 2>/dev/null; then \
      echo "[pnpm] patched onlyBuiltDependencies"; \
    fi

# Install prod deps including postinstall scripts for @prisma/engines.
RUN pnpm install --prod --no-lockfile 2>&1 | tail -5 || true

# Copy the compiled bundle (main.js has all internal libs bundled by webpack)
COPY --from=builder /workspace/dist/apps/${APP}/main.js ./main.js

# Copy .proto files — gRPC loads them at runtime via protoPath
# GRPC_PROTO_DIR env var points here: /app/libs/grpc/protos
COPY --from=builder /workspace/libs/grpc/protos ./libs/grpc/protos

# ---------------------------------------------------------------------------
# Prisma artifacts — only for services with a schema (auth-service, club-service)
# ---------------------------------------------------------------------------

# 1. Prisma generated client
#    Webpack externalizes require(".prisma/auth-client") as a bare module specifier.
#    Node resolves bare specifiers (starting with "." but NOT "./") by walking up
#    the directory tree looking for node_modules/.prisma/<name>-client.
#    Since main.js lives at /app/main.js, the client must be in
#    /app/node_modules/.prisma/<name>-client (node_modules resolution, NOT relative).
RUN --mount=type=bind,from=builder,source=/workspace/node_modules/.prisma,target=/prisma-clients \
    CLIENT_NAME=$(echo "${APP}" | sed 's/-service$//') && \
    if [ -d "/prisma-clients/${CLIENT_NAME}-client" ]; then \
      mkdir -p /app/node_modules/.prisma && \
      cp -r "/prisma-clients/${CLIENT_NAME}-client" "/app/node_modules/.prisma/${CLIENT_NAME}-client"; \
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

# 3. Prisma CLI + client runtime + engines — only for services with a schema (auth, club).
#
#    The NX-generated package.json does not include `prisma` (CLI) because webpack
#    bundles it away or it is not directly imported.  We need the CLI for migrations.
#    We also need @prisma/client because the generated .prisma/<name>-client/runtime/client.js
#    requires '@prisma/client-runtime-utils', which ships inside @prisma/client.
#
#    Strategy: install prisma + @prisma/client + @prisma/engines in an isolated temp dir
#    using pnpm (with onlyBuiltDependencies so @prisma/engines postinstall downloads
#    linux-musl binaries).  Then copy the entire isolated node_modules into /app —
#    pnpm symlinks remain valid because they are relative paths inside the same tree.
RUN if [ -f "/app/prisma/schema.prisma" ]; then \
      echo "[prisma] installing CLI + client via npm..." && \
      mkdir -p /tmp/prisma-npm && \
      cd /tmp/prisma-npm && \
      npm install \
        prisma@6.19.3 \
        "@prisma/client@6.19.3" \
        "@prisma/engines@6.19.3" \
        --save-exact --omit=dev --no-package-lock 2>&1 | tail -5 && \
      mkdir -p /app/node_modules && \
      cp -r /tmp/prisma-npm/node_modules/. /app/node_modules/ && \
      rm -rf /tmp/prisma-npm && \
      echo "[prisma] done"; \
    else \
      echo "[prisma] No schema found — skipping prisma install (non-Prisma service)"; \
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
