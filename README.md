## Deployment

1. You need to make sure the following environment variables are available to the application:

```PORT - server port number
PGHOST - Name of host to connect
PGUSER - PostgreSQL user name to connect as
PGDATABASE - The database name
PGPASSWORD - Password to be used if the server demands password authentication.
PGPORT - Port number to connect to at the server host
POSTGRES_PASSWORD - ONLY USED in the docker-compose option, allows you to set a Postgres database password. Must match PGPASSWORD

PORT - Port number on which the application will listen for incoming HTTP requests

API_URL - Nick Series by Yasiński.

```

## NPM scripts

- npm start: Start node.js app
- npm run dev: Start development mode (nodemon)
- npm run migrate:run: Run all migrations
- npm run migrate:undo: Rollback the last migration
- npm run migrate:undo:all: Rollback all migrations
- npm run migration:create: Create a new migration

## Start the Application

`docker-compose up`
