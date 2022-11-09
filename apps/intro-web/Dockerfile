ARG NODE_VERSION=16
ARG ALPINE_VERSION=3.15
ARG PUBLIC_API_ORIGIN=http://localhost:3000

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS deps
RUN apk add --no-cache rsync

WORKDIR /workspace-install

COPY package-lock.json package-lock.json 

RUN --mount=type=bind,target=/docker-context \
    rsync -amv --delete \
          --exclude='node_modules' \
          --exclude='*/node_modules' \
          --include='package.json' \
          --include='*/' --exclude='*' \
          /docker-context/ /workspace-install/;

# @see https://www.prisma.io/docs/reference/api-reference/environment-variables-reference#cli-binary-targets
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl

RUN npm install


###################################################################
# Stage 2: Build the app                                          #
###################################################################

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder
ENV NODE_ENV=production
ENV PUBLIC_API_ORIGIN ${PUBLIC_API_ORIGIN}

WORKDIR /app

COPY . .
COPY --from=deps /workspace-install ./

RUN npm run build:intro-web

###################################################################
# Stage 3: Extract a minimal image from the build                 #
###################################################################

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/intro-web/astro.config.mjs \
                    /app/apps/intro-web/package.json \
                    ./apps/intro-web/

COPY --from=builder /app/apps/intro-web/public ./apps/intro-web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/intro-web/dist ./apps/intro-web/dist

COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

WORKDIR /app/apps/intro-web

CMD ["npm", "run", "start"]