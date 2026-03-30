# Club Service Specification

## Purpose

This specification defines the behavior of the club-service, a multi-tenant microservice responsible for managing sports clubs, student enrollment, and membership operations in the SaaS platform.

## Requirements

### Requirement: Club Management

The system MUST provide CRUD operations for sports clubs with multi-tenant isolation.

#### Scenario: Create new club

- GIVEN a valid tenant with OWNER role
- WHEN creating a club with valid name and sport
- THEN a club is created with unique ID
- AND the club is associated with the tenant

#### Scenario: List tenant clubs

- GIVEN a tenant with existing clubs
- WHEN requesting club list
- THEN only clubs belonging to that tenant are returned
- AND clubs are ordered by creation date

#### Scenario: Update club information

- GIVEN an existing club owned by tenant
- WHEN updating club name or sport
- THEN club information is updated
- AND updatedAt timestamp is refreshed

### Requirement: Student Management

The system MUST allow student registration and enrollment with validation.

#### Scenario: Register new student

- GIVEN valid student information (name, email, phone)
- WHEN registering a student in a tenant
- THEN student is created with unique ID
- AND student email MUST be unique within tenant

#### Scenario: Enroll student in club

- GIVEN an existing student and club in same tenant
- WHEN creating a membership
- THEN membership links student to club
- AND membership has ACTIVE status by default

#### Scenario: Prevent duplicate enrollment

- GIVEN a student already enrolled in a club
- WHEN attempting to enroll same student again
- THEN system MUST reject with validation error
- AND existing membership remains unchanged

### Requirement: Membership Management

The system MUST track membership status and provide lifecycle operations.

#### Scenario: Create membership

- GIVEN valid student and club IDs in same tenant
- WHEN creating membership with start date
- THEN membership is created with ACTIVE status
- AND membership belongs to the tenant

#### Scenario: Suspend membership

- GIVEN an active membership
- WHEN changing status to SUSPENDED
- THEN membership status is updated
- AND student retains club association

#### Scenario: List club members

- GIVEN a club with enrolled students
- WHEN requesting member list
- THEN all ACTIVE memberships are returned
- AND student details are included

### Requirement: Multi-tenant Isolation

The system MUST enforce strict tenant boundaries for all operations.

#### Scenario: Tenant data isolation

- GIVEN multiple tenants with clubs and students
- WHEN any tenant requests data
- THEN only data belonging to that tenant is accessible
- AND no cross-tenant data leakage occurs

#### Scenario: Cross-tenant operation rejection

- GIVEN student from tenant A and club from tenant B
- WHEN attempting to create membership
- THEN system MUST reject with authorization error
- AND no membership is created

### Requirement: Data Validation

The system MUST validate all input data according to business rules.

#### Scenario: Invalid email format

- GIVEN student registration with invalid email
- WHEN submitting the request
- THEN system MUST reject with validation error
- AND provide specific error message

#### Scenario: Empty club name

- GIVEN club creation with empty name
- WHEN submitting the request
- THEN system MUST reject with validation error
- AND no club is created
