ARG NODE_VERSION=16
ARG ALPINE_VERSION=3.15

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
          --include='*/' --exclude='*' \
          /docker-context/ /workspace-install/;

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

COPY --from=builder /app/apps/pb/package.json ./apps/pb/package.json
COPY --from=builder /app/apps/pb/dist ./apps/pb/dist

COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER app
EXPOSE 3030

WORKDIR /app/apps/api

CMD ["npm", "run", "start"]