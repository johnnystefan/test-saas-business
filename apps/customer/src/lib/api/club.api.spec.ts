/**
 * club.api.ts — snake_case → camelCase mapping tests
 *
 * AD-2: All snake_case→camelCase transformation happens in the API layer via Zod parsing.
 *       Consumers always receive camelCase domain types.
 *
 * Scenario: API snake_case → camelCase mapping
 * GIVEN the backend returns snake_case fields (gRPC passthrough)
 * WHEN getMemberships() or getBusinessUnits() is called
 * THEN the returned objects have camelCase fields matching domain types
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── VITE env must be set before client.ts is loaded ──────────────────────────
Object.assign(import.meta.env, {
  VITE_TENANT_ID: 'test-tenant-id',
  VITE_API_URL: 'http://localhost:3000/api/v1',
});

// ── Mock the HTTP client so no real requests are made ────────────────────────
vi.mock('./client', () => ({
  publicClient: {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
  authClient: {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
}));

// ── Object Mothers — raw snake_case backend payloads ─────────────────────────

const RawMembershipMother = {
  active: () => ({
    id: 'mem-001',
    tenant_id: 'tenant-test-123',
    member_id: 'member-abc',
    business_unit_id: 'bu-xyz',
    status: 'ACTIVE',
    start_date: '2026-01-01',
    end_date: '2026-12-31',
  }),
  withoutOptionalFields: () => ({
    id: 'mem-002',
    tenant_id: 'tenant-test-123',
    member_id: 'member-abc',
    business_unit_id: 'bu-xyz',
    status: 'ACTIVE',
    start_date: '2026-01-01',
    // end_date, created_at, updated_at intentionally absent
  }),
  expired: () => ({
    id: 'mem-003',
    tenant_id: 'tenant-test-123',
    member_id: 'member-abc',
    business_unit_id: 'bu-xyz',
    status: 'EXPIRED',
    start_date: '2025-01-01',
    end_date: '2025-12-31',
  }),
};

const RawBusinessUnitMother = {
  academy: () => ({
    id: 'bu-001',
    tenant_id: 'tenant-test-123',
    name: 'Academia The Stadium',
    type: 'BASEBALL_ACADEMY',
    is_active: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-01T00:00:00.000Z',
  }),
  inactive: () => ({
    id: 'bu-002',
    tenant_id: 'tenant-test-123',
    name: 'Academia Cerrada',
    type: 'GYM',
    is_active: false,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-06-01T00:00:00.000Z',
  }),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('getMemberships — snake_case → camelCase mapping', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps snake_case fields to camelCase domain Membership type', async () => {
    // Arrange
    const { authClient } = await import('./client');
    vi.mocked(authClient.get).mockResolvedValueOnce({
      data: { items: [RawMembershipMother.active()] },
    });

    // Act
    const { getMemberships } = await import('./club.api');
    const result = await getMemberships();

    // Assert — ALL snake_case fields are mapped to camelCase
    expect(result).toHaveLength(1);
    const m = result[0];
    expect(m.id).toBe('mem-001');
    expect(m.tenantId).toBe('tenant-test-123'); // tenant_id → tenantId
    expect(m.memberId).toBe('member-abc'); // member_id → memberId
    expect(m.businessUnitId).toBe('bu-xyz'); // business_unit_id → businessUnitId
    expect(m.status).toBe('ACTIVE');
    expect(m.startDate).toBe('2026-01-01'); // start_date → startDate
    expect(m.endDate).toBe('2026-12-31'); // end_date → endDate
  });

  it('maps an array of memberships correctly', async () => {
    // Arrange
    const { authClient } = await import('./client');
    vi.mocked(authClient.get).mockResolvedValueOnce({
      data: {
        items: [RawMembershipMother.active(), RawMembershipMother.expired()],
      },
    });

    // Act
    const { getMemberships } = await import('./club.api');
    const result = await getMemberships();

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0].status).toBe('ACTIVE');
    expect(result[1].status).toBe('EXPIRED');
  });

  it('returns endDate as null when end_date is absent from response', async () => {
    // Arrange
    const { authClient } = await import('./client');
    vi.mocked(authClient.get).mockResolvedValueOnce({
      data: { items: [RawMembershipMother.withoutOptionalFields()] },
    });

    // Act
    const { getMemberships } = await import('./club.api');
    const result = await getMemberships();

    // Assert — missing end_date maps to null, not undefined
    expect(result[0].endDate).toBeNull();
  });

  it('handles a plain array response (non-paginated fallback)', async () => {
    // Arrange
    const { authClient } = await import('./client');
    vi.mocked(authClient.get).mockResolvedValueOnce({
      data: [RawMembershipMother.active()],
    });

    // Act
    const { getMemberships } = await import('./club.api');
    const result = await getMemberships();

    // Assert — fallback path also maps correctly
    expect(result).toHaveLength(1);
    expect(result[0].tenantId).toBe('tenant-test-123');
  });
});

describe('getBusinessUnits — snake_case → camelCase mapping', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps snake_case fields to camelCase BusinessUnitPrimitives type', async () => {
    // Arrange
    const { authClient } = await import('./client');
    vi.mocked(authClient.get).mockResolvedValueOnce({
      data: { items: [RawBusinessUnitMother.academy()] },
    });

    // Act
    const { getBusinessUnits } = await import('./club.api');
    const result = await getBusinessUnits();

    // Assert — ALL snake_case fields are mapped to camelCase
    expect(result).toHaveLength(1);
    const bu = result[0];
    expect(bu.id).toBe('bu-001');
    expect(bu.tenantId).toBe('tenant-test-123'); // tenant_id → tenantId
    expect(bu.name).toBe('Academia The Stadium');
    expect(bu.type).toBe('BASEBALL_ACADEMY');
    expect(bu.isActive).toBe(true); // is_active → isActive
    expect(bu.createdAt).toBe('2025-01-01T00:00:00.000Z'); // created_at → createdAt
    expect(bu.updatedAt).toBe('2025-01-01T00:00:00.000Z'); // updated_at → updatedAt
  });

  it('maps inactive business units correctly', async () => {
    // Arrange
    const { authClient } = await import('./client');
    vi.mocked(authClient.get).mockResolvedValueOnce({
      data: { items: [RawBusinessUnitMother.inactive()] },
    });

    // Act
    const { getBusinessUnits } = await import('./club.api');
    const result = await getBusinessUnits();

    // Assert
    expect(result[0].isActive).toBe(false);
    expect(result[0].type).toBe('GYM');
  });

  it('handles a plain array response (non-paginated fallback)', async () => {
    // Arrange
    const { authClient } = await import('./client');
    vi.mocked(authClient.get).mockResolvedValueOnce({
      data: [RawBusinessUnitMother.academy()],
    });

    // Act
    const { getBusinessUnits } = await import('./club.api');
    const result = await getBusinessUnits();

    // Assert — fallback path also maps correctly
    expect(result).toHaveLength(1);
    expect(result[0].isActive).toBe(true);
  });
});
