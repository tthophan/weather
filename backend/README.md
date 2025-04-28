# TemplateNestJSService

- _Service name:_ weather-service
- _Framework:_ NestJS
- _DatabaseORM:_ Prisma

# Source code structure

```
├── README.md
├── nest-cli.json
├── yarn.lock
├── package.json
├── prisma
├── migrate
├── src
│   ├── app.module.ts
│   ├── main.ts
│   ├── config
│       ├── configuration.ts
│       └── validation.ts
│   ├── constants (for service constants)
│   ├── decorators (for some decorators)
│   ├── exceptions (exception modoles)
│   ├── filters (middleware for error handler)
│   ├── interceptors (service interceptors)
│   ├── interfaces (for the service interfaces)
│   ├── middlewares (service middlewares)
│   ├── models (some service common models)
│   ├── modules
│       ├── health
│       ├── http
│       ├── loggers
│       ├── prisma (prisma service)
│       ├── shared (the folder to define the shared services)
│       └── ... (domain modules)
│   ├── types
│   ├── utils
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── migrations.sh
├── Dockerfile
└── tsconfig.json
```

### Environment Variables Configuration

# ENV(s)

| Name                   | Description                                                 | Default Value |
| ---------------------- | ----------------------------------------------------------- | ------------- |
| TZ                     | The timezone of the service                                 | UTC           |
| ENVIRONMENT            | The environment (development, production, test, provision)  |               |
| PORT                   | The port on which the service runs                          | 3000          |
| LOG_LEVEL              | The verbosity level of logging (e.g: info)                  | log           |
| POSTGRESQL_USER        | The username for the PostgreSQL database                    |               |
| POSTGRESQL_PASSWORD    | The password for the PostgreSQL database                    |               |
| POSTGRESQL_DB          | The name of the PostgreSQL database                         |               |
| POSTGRESQL_HOST        | The hostname or IP address of the PostgreSQL server         |               |
| POSTGRESQL_PORT        | The port number on which the PostgreSQL server is listening |               |
| HTTP_REQUEST_TIMEOUT   | The timeout duration for HTTP requests (in milliseconds)    |               |
| REDIS_MODE             | client or cluster                                           | client        |
| REDIS_HOST             | client redis host                                           | localhost     |
| REDIS_PORT             | client redis port                                           | 6379          |
| REDIS_CLUSTER_NODES    | The list of redis node in cluster mode. Split by comma.     |               |
| RATE_LIMIT_ENABLED     | The flag to enable Rate limit.                              | true          |
| RATE_LIMIT_TIME_WINDOW | The time window in milliseconds.                            | 1000          |
| RATE_LIMIT             | The number of requests allowed per time window.             | 100           |

# How to install dependencies

## For dev

```bash
$ yarn install
```

## For production

```bash
$ yarn install --frozen-lockfile
```

# How to create/ apply new migration

## Create new migration

```bash
$ ./migration <migration_name>
```

## Apply the migration

```bash
$ yarn prisma:up
```

Note: Please setup the `DATABASE_URL` point to the database engine we want to migrate

# How to run the service

- Copy the `.env.example` to `.env` and config the env environment
- Install the dependencies
- Install prisma client

```bash
$ npx prisma generate
```

- Run the command to run the service

```bash
$ yarn start:dev
```

# How to run the unit test / coverage test

## Unit test

```bash
$ yarn test
```

## Coverage test

```bash
$ yarn test:cov
```
