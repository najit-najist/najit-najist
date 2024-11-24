# Global variables
ARG NODE_VERSION=20
ARG ALPINE_VERSION=3.18
ARG DATABASE_URL
ARG TURBO_TEAM
ARG TURBO_TOKEN
ARG NEXT_PUBLIC_LOGTAIL_TOKEN
ARG NEXT_PUBLIC_PACKETA_KEY

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN pnpm config set node-linker hoisted

###################################################################
# Stage 1: Install deps                                           #
###################################################################
FROM base AS deps

RUN apk add --no-cache rsync
RUN apk add --no-cache libc6-compat

WORKDIR /workspace-install

COPY pnpm-lock.yaml pnpm-lock.yaml
COPY pnpm-workspace.yaml pnpm-workspace.yaml

RUN --mount=type=bind,target=/docker-context \
    rsync -amv --delete \
    --exclude='node_modules' \
    --exclude='*/node_modules' \
    --include='package.json' \
    --include='*/package.json' \
    --include='*/' --exclude='*' \
    /docker-context/ /workspace-install/;

RUN apk add g++ make py3-pip
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

###################################################################
# Stage 2: Build the app                                          #
###################################################################

FROM base AS builder

ARG DATABASE_URL
ARG TURBO_TEAM
ARG TURBO_TOKEN
ARG NEXT_PUBLIC_LOGTAIL_TOKEN
ARG NEXT_PUBLIC_PACKETA_KEY

ENV DATABASE_URL=${DATABASE_URL}
ENV NODE_ENV=production
ENV TURBO_TEAM=${TURBO_TEAM}
ENV TURBO_TOKEN=${TURBO_TOKEN}
ENV NEXT_PUBLIC_LOGTAIL_TOKEN=${NEXT_PUBLIC_LOGTAIL_TOKEN}
ENV NEXT_PUBLIC_PACKETA_KEY=${NEXT_PUBLIC_PACKETA_KEY}

RUN apk add --no-cache rsync
RUN apk add --no-cache libc6-compat

WORKDIR /workspace-builder
RUN mkdir -p /workspace-builder/apps/web/private

COPY . .
COPY --from=deps /workspace-install ./

RUN echo $(ls -1 /workspace-builder/packages)
RUN pnpm config set node-linker hoisted
RUN apk add g++ make py3-pip
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN npm run build:web

###################################################################
# Stage 3: Extract a minimal image from the build                 #
###################################################################

FROM base AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /workspace-builder/package.json \
    /workspace-builder/pnpm-lock.yaml \
    /workspace-builder/pnpm-workspace.yaml \
    ./

COPY --from=builder /workspace-builder/apps/web/next.config.mjs \
    /workspace-builder/apps/web/package.json \
    /workspace-builder/apps/web/next-env.d.ts \
    /workspace-builder/apps/web/src/ \
    ./apps/web/

COPY --from=builder --chown=nextjs:nodejs /workspace-builder/.dokku/app.json ./.dokku/app.json

COPY --from=builder --chown=nextjs:nodejs /workspace-builder/apps/web/.next ./apps/web/.next
COPY --from=builder --chown=nextjs:nodejs /workspace-builder/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /workspace-builder/apps/web/private ./apps/web/private

COPY --from=builder /workspace-builder/packages/comgate/ ./packages/comgate/
COPY --from=builder /workspace-builder/packages/database/ ./packages/database/
COPY --from=builder /workspace-builder/packages/najit-najist-tailwind-plugin/ ./packages/najit-najist-tailwind-plugin/
COPY --from=builder /workspace-builder/packages/packeta/ ./packages/packeta/
COPY --from=builder /workspace-builder/packages/schemas/ ./packages/schemas/
COPY --from=builder /workspace-builder/packages/security/ ./packages/security/
COPY --from=builder /workspace-builder/packages/ui/ ./packages/ui/

# Copy node_modules
COPY --from=builder /workspace-builder/node_modules             ./node_modules
COPY --from=builder /workspace-builder/package.json             ./package.json

USER nextjs

EXPOSE 4000
ENV HOSTNAME "0.0.0.0"

WORKDIR /app

ENV NODE_ENV=production

CMD ["npm", "run", "start-production"]
