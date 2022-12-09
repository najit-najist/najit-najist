# najitnajist.cz

## Apps and ports

### Ports

- web: 
  - dev: `3000`
  - prod: `4000`
  - can be changed in [package.json](./apps/web/package.json)

- api: 
  - dev, prod: `process.env.PORT` (default is `3001`) 
  - prod by dockerfile: `3030`
  - can be changed in [Dockerfile](./apps/api/Dockerfile) and [config.ts](./apps/api/src/config.ts)