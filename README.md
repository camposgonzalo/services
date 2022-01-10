# Apis de eduqy

## Estructura de directorios:

### src

- general
  - common
    - Schemas: Esquemas de validación json
    - Utils: otros módulos compartidos
- memberships
  - common
    - Models: Entidades y queries
    - Schemas: Esquemas de validación json
  - functions: Funciones lambdas
- schools
  - common
    - Models: Entidades y queries
    - Schemas: Esquemas de validación json
  - functions: Funciones lambdas

## Endpoints:

### memberships

- POST /memberships
  - Create membership.
- GET /memberships
  - Get memberships
- PATCH /memberships/{id}
  - Update membership

### schools

- POST /schools
  - Create school.
- GET /schools/{id}
  - Get membership
- PATCH /schools/{id}
  - Update membership

### helpers

- POST /helpers
  - Create helper.
- GET /helpers/{userType}
  - Get helper by user type

## Diagrama NoSQL

![Screenshot](DER.jpg)
