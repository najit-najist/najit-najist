ARG NODE_VERSION=16
ARG ALPINE_VERSION=3.15
ARG NEXT_PUBLIC_API_ORIGIN=http://localhost:3000

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
ARG NEXT_PUBLIC_API_ORIGIN
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_ORIGIN=${NEXT_PUBLIC_API_ORIGIN}

WORKDIR /app

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

COPY --from=builder /app/apps/web/next.config.mjs \
                    /app/apps/web/package.json \
                    /app/apps/web/next-env.d.ts \
                    ./apps/web/

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next ./apps/web/.next

# Include api package as it its a monorepo dependency 
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist


# Include ui package as it its a monorepo dependency 
COPY --from=builder /app/packages/najit-najist-ui/package.json ./packages/najit-najist-ui/package.json
COPY --from=builder /app/packages/najit-najist-ui/dist ./packages/najit-najist-ui/dist

# Copy node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 4000

WORKDIR /app/apps/web

CMD ["npm", "run", "start"]