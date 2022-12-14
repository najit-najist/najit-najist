ARG NODE_VERSION=16
ARG ALPINE_VERSION=3.15

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS deps
RUN apk add --no-cache rsync

WORKDIR /workspace-install

COPY package-lock.json package-lock.json 

RUN --mount=type=bind,target=/docker-context \
    rsync -amv --delete \
          --exclude='node_modules' \
          --exclude='*/node_modules' \
          --include='package.json' \
          --include='schema.prisma' \
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

WORKDIR /app

COPY . .
COPY --from=deps /workspace-install ./

RUN npm run build:api

###################################################################
# Stage 3: Extract a minimal image from the build                 #
###################################################################

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS runner

WORKDIR /app

ENV NODE_ENV production
ENV PORT 3030

RUN addgroup --system --gid 1001 app && adduser --system --uid 1001 app

COPY --from=builder --chown=app:app /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder --chown=app:app /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=app:app /app/apps/api/email-templates ./apps/api/email-templates
COPY --from=builder --chown=app:app /app/apps/api/prisma ./apps/api/prisma

# Copy node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER app
EXPOSE 3030

WORKDIR /app/apps/api
RUN npx prisma generate

CMD ["npm", "run", "start"]