# Global variables
ARG NODE_VERSION=18
ARG ALPINE_VERSION=3.18
ARG DATABASE_URL
ARG TURBO_TEAM
ARG TURBO_TOKEN

###################################################################
# Stage 1: Install deps                                           #
###################################################################
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS deps

RUN apk add --no-cache rsync
RUN apk add --no-cache libc6-compat

WORKDIR /workspace-install

COPY package-lock.json package-lock.json 

RUN --mount=type=bind,target=/docker-context \
    rsync -amv --delete \
          --exclude='node_modules' \
          --exclude='*/node_modules' \
          --include='package.json' \
          --include='*/package.json' \
          --include='*/' --exclude='*' \
          /docker-context/ /workspace-install/;

RUN npm install


###################################################################
# Stage 2: Build the app                                          #
###################################################################

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder

ARG DATABASE_URL
ARG TURBO_TEAM
ARG TURBO_TOKEN

ENV DATABASE_URL=${DATABASE_URL}
ENV NODE_ENV=production
ENV TURBO_TEAM=${TURBO_TEAM}
ENV TURBO_TOKEN=${TURBO_TOKEN}

RUN apk add --no-cache rsync
RUN apk add --no-cache libc6-compat

WORKDIR /workspace-builder

COPY . .
COPY --from=deps /workspace-install ./

RUN npm run build:web

###################################################################
# Stage 3: Extract a minimal image from the build                 #
###################################################################

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /workspace-builder/apps/web/next.config.mjs \
                    /workspace-builder/apps/web/package.json \
                    /workspace-builder/apps/web/next-env.d.ts \
                    /workspace-builder/apps/web/src/ \
                    ./apps/web/

COPY --from=builder --chown=nextjs:nodejs /workspace-builder/apps/web/.next ./apps/web/.next
COPY --from=builder --chown=nextjs:nodejs /workspace-builder/apps/web/public ./apps/web/public

# Include api package as it its a monorepo dependency 
COPY --from=builder /workspace-builder/packages/api/package.json \
                    /workspace-builder/packages/api/node_modules/ \
                    /workspace-builder/packages/api/dist/ \
                    ./packages/api/

COPY --from=builder /workspace-builder/packages/database/package.json \
                    /workspace-builder/packages/database/dist/ \
                    /workspace-builder/packages/database/drizzle/ \
                    ./packages/security/

COPY --from=builder /workspace-builder/packages/email-templates/package.json \
                    /workspace-builder/packages/email-templates/dist/ \
                    /workspace-builder/packages/email-templates/node_modules/ \
                    ./packages/email-templates/

COPY --from=builder /workspace-builder/packages/najit-najist-tailwind-plugin/package.json \
                    /workspace-builder/packages/najit-najist-tailwind-plugin/index.cjs \
                    ./packages/najit-najist-tailwind-plugin/

COPY --from=builder /workspace-builder/packages/schemas/package.json \
                    /workspace-builder/packages/schemas/node_modules/ \
                    /workspace-builder/packages/schemas/dist/ \
                    ./packages/schemas/

COPY --from=builder /workspace-builder/packages/security/package.json \
                    /workspace-builder/packages/security/dist/ \
                    ./packages/security/

# Include ui package as it its a monorepo dependency 
COPY --from=builder /workspace-builder/packages/ui/package.json \
                    /workspace-builder/packages/ui/dist/ \
                    /workspace-builder/packages/ui/node_modules/ \
                    ./packages/ui/

# Copy node_modules
COPY --from=builder /workspace-builder/node_modules             ./node_modules
COPY --from=builder /workspace-builder/package.json             ./package.json

USER nextjs

EXPOSE 4000
ENV HOSTNAME "0.0.0.0"

WORKDIR /app/apps/web

CMD ["npm", "run", "start"]