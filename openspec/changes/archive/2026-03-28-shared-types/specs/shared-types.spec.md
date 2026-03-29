# shared-types Specification

## Purpose

Define the foundational data contracts, Zod schemas, inferred types, and error infrastructure that cross service boundaries in the SaaS Platform.

## Requirements

### Requirement: BaseEntitySchema and TenantedEntitySchema

The system MUST provide base schemas for entity identification and timestamps. All IDs MUST be UUID strings. All timestamps MUST be ISO strings. Tenant-scoped entities MUST include a valid `tenantId`.

#### Scenario: Validating a global entity

- GIVEN a payload for a global entity
- WHEN it is validated against `BaseEntitySchema`
- THEN it MUST succeed if `id` is a valid UUID and `createdAt`/`updatedAt` are valid ISO date strings
- AND it MUST fail if `id` is missing or not a UUID

#### Scenario: Validating a tenant-scoped entity

- GIVEN a payload for a tenant-scoped entity
- WHEN it is validated against `TenantedEntitySchema`
- THEN it MUST succeed if `tenantId` is a valid, non-empty UUID string alongside base entity properties
- AND it MUST fail if `tenantId` is omitted, empty, or not a UUID (hard spec violation)

### Requirement: TenantSchema

The system MUST provide a `TenantSchema` defining the core tenant structure.

#### Scenario: Validating a Tenant

- GIVEN a tenant payload
- WHEN validated against `TenantSchema`
- THEN it MUST succeed if it contains `id` (uuid), `name` (string), `slug` (string), `plan` (string), `status` (string), and timestamps (ISO strings)

### Requirement: UserSchema and Roles

The system MUST provide a `UserSchema` for user identity and a `USER_ROLE` constant using the `const STATUS = {} as const` pattern. Types MUST be inferred via `z.infer<typeof UserSchema>`.

#### Scenario: Validating a User with a valid role

- GIVEN a user payload with a role defined in `USER_ROLE`
- WHEN validated against `UserSchema`
- THEN it MUST succeed and require `id`, `email`, `name`, `role`, `tenantId`, `status`, and timestamps

#### Scenario: Validating a User with an invalid role

- GIVEN a user payload with an unknown role
- WHEN validated against `UserSchema`
- THEN it MUST fail validation

### Requirement: MemberSchema and Status

The system MUST provide a `MemberSchema` for club members, including optional contact fields and a `MEMBER_STATUS` constant object.

#### Scenario: Validating a complete Member

- GIVEN a member payload with all fields including `email` and `phone`
- WHEN validated against `MemberSchema`
- THEN it MUST succeed and include `tenantId`, `name`, `status` (from `MEMBER_STATUS`), `enrolledAt` (ISO string), and timestamps

#### Scenario: Validating a minimal Member

- GIVEN a member payload without `email` and `phone`
- WHEN validated against `MemberSchema`
- THEN it MUST succeed as those fields are optional

### Requirement: BusinessUnitSchema and Types

The system MUST provide a `BusinessUnitSchema` for physical locations and a `BUSINESS_UNIT_TYPE` constant object.

#### Scenario: Validating a Business Unit

- GIVEN a business unit payload
- WHEN validated against `BusinessUnitSchema`
- THEN it MUST succeed if it contains `id`, `tenantId`, `name`, `type` (from `BUSINESS_UNIT_TYPE`), `isActive` (boolean), and timestamps

### Requirement: API Responses

The system MUST provide generic schemas for API responses (`ApiResponse<T>`) and paginated data (`PaginatedResponse<T>`).

#### Scenario: Formatting a standard API response

- GIVEN a successful operation returning data
- WHEN wrapped in an `ApiResponse<T>`
- THEN the response MUST contain `data` (of type T) and a `message` string

#### Scenario: Formatting a paginated response

- GIVEN a list of records
- WHEN formatted as a `PaginatedResponse<T>`
- THEN the response MUST contain `data` (array of T), `total` (number), `page` (number), and `pageSize` (number)

### Requirement: DomainError Infrastructure

The system MUST provide a `DomainError` abstract class and a `DOMAIN_ERROR_TYPE` constant map containing all standard error codes.

#### Scenario: Creating a DomainError

- GIVEN a domain failure
- WHEN a class extends `DomainError`
- THEN it MUST be instantiable with a `code` (from `DOMAIN_ERROR_TYPE`), `title`, `message`, and optional `context` data

#### Scenario: Accessing error types

- GIVEN the need to reference an error code
- WHEN accessing `DOMAIN_ERROR_TYPE`
- THEN it MUST provide a strictly typed map of error codes using the `const = {} as const` pattern
