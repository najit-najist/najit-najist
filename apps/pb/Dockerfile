FROM alpine:3 as downloader

ARG VERSION=0.10.4

RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${VERSION}/pocketbase_${VERSION}_linux_amd64.zip \
    && unzip pocketbase_${VERSION}_linux_amd64.zip \
    && chmod +x /pocketbase

FROM alpine:3
RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/*

EXPOSE 8090

WORKDIR /usr/local/bin/

COPY --from=downloader /pocketbase /pocketbase
ENTRYPOINT ["/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb_data", "--publicDir=/pb_public", "--migrationsDir=/pb_migrations", "--encryptionEnv=SESSION_SECRET"]