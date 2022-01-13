# Eduqy apis

## Directory structure

### src

#### general

  - common
    - Schemas: Esquemas de validación json
    - Utils: otros módulos compartidos

#### memberships

  - common
    - Models: Entidades y queries
    - Schemas: Esquemas de validación json
  - functions: Funciones lambdas

#### schools

  - common
    - Models: Entidades y queries
    - Schemas: Esquemas de validación json
  - functions: Funciones lambdas

#### helpers

  - common
    - Models: Entidades y queries
    - Schemas: Esquemas de validación json
  - functions: Funciones lambdas

## Endpoints:

### [helpers](src/helpers/swagger.yaml)

  - POST /helpers
    - Create helper.
  - GET /helpers/{userType}
    - Get helper by user type

### [memberships](src/memberships/swagger.yaml)

  - POST /memberships
    - Create membership.
  - GET /memberships
    - Get memberships
  - PATCH /memberships/{id}
    - Update membership

### [schools](src/schools/swagger.yaml)

  - POST /schools
    - Create school.
  - GET /schools
    - Get schools.
  - GET /schools/{id}
    - Get membership
  - PATCH /schools/{id}
    - Update membership

## NoSQL Diagram

![Screenshot](DER.jpg)
