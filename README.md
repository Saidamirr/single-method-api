# Locus API

Test task implementation using NestJS, TypeScript, PostgreSQL and TypeORM.

## Features

* JWT authentication
* Role-based access control
* Swagger/OpenAPI documentation
* TypeORM entities and relations
* Filtering
* Pagination
* Sorting
* Sideloading of locus members
* Unit and e2e tests

## Database

The application uses the public PostgreSQL database provided in the task.

Tables used:

* rnacen.rnc_locus
* rnacen.rnc_locus_members

Relation:

* rnc_locus.id -> rnc_locus_members.locus_id

## Installation

```bash
npm install
```

## Run application

```bash
npm run start:dev
```

Application:

```text
http://localhost:3000
```

Swagger:

```text
http://localhost:3000/api
```

## Authentication

Login endpoint:

```http
POST /auth/login
```

Predefined users:

| Username | Password | Role    |
| -------- | -------- | ------- |
| admin    | admin    | admin   |
| normal   | normal   | normal  |
| limited  | limited  | limited |

After login use the returned JWT token in Swagger Authorize dialog.

## Endpoint

```http
GET /locus
```

Available query parameters:

* id
* assemblyId
* regionId
* membershipStatus
* sideloading
* page
* limit
* sortBy
* sortOrder

## Permissions

### Admin

* Access to all data
* Can use sideloading=locusMembers

### Normal

* Access to locus data
* Cannot use sideloading

### Limited

* Restricted to region IDs:

```text
86118093
86696489
88186467
```

Note: the public dataset currently contains no rows for these region IDs, therefore requests made by the limited user may return an empty array.

## Tests

Run unit tests:

```bash
npm test
```

Run e2e tests:

```bash
npm run test:e2e
```
