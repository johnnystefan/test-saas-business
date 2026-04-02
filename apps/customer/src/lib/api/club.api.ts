/**
 * Club API — memberships and business units.
 *
 * AD-2: All snake_case→camelCase transformation happens here via Zod parsing.
 *       Consumers receive camelCase domain types matching @saas/shared-types schemas.
 */

import { z } from 'zod/v4';
import { MembershipStatus } from '@saas/shared-types';
import { authClient } from './client';
import type { Membership } from '@saas/shared-types';
import type { BusinessUnitPrimitives } from '@saas/shared-types';

// ── Raw API response schemas (snake_case from gRPC passthrough) ─────────────

const RawMembershipSchema = z.object({
  id: z.string(),
  tenant_id: z.string(),
  member_id: z.string(),
  business_unit_id: z.string(),
  status: z.enum(
    Object.values(MembershipStatus) as [
      MembershipStatus,
      ...MembershipStatus[],
    ],
  ),
  start_date: z.string(),
  end_date: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

const RawBusinessUnitSchema = z.object({
  id: z.string(),
  tenant_id: z.string(),
  name: z.string().min(1),
  type: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

const RawMembershipsResponseSchema = z.object({
  items: z.array(RawMembershipSchema),
});

const RawBusinessUnitsResponseSchema = z.object({
  items: z.array(RawBusinessUnitSchema),
});

// ── Mappers ─────────────────────────────────────────────────────────────────

function mapRawMembership(
  raw: z.infer<typeof RawMembershipSchema>,
): Membership {
  return {
    id: raw.id,
    tenantId: raw.tenant_id,
    memberId: raw.member_id,
    businessUnitId: raw.business_unit_id,
    status: raw.status,
    startDate: raw.start_date,
    endDate: raw.end_date,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function mapRawBusinessUnit(
  raw: z.infer<typeof RawBusinessUnitSchema>,
): BusinessUnitPrimitives {
  return {
    id: raw.id,
    tenantId: raw.tenant_id,
    name: raw.name,
    type: raw.type as BusinessUnitPrimitives['type'],
    isActive: raw.is_active,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

// ── API functions ────────────────────────────────────────────────────────────

/**
 * GET /club/members/memberships
 * Returns camelCase Membership[].
 */
export async function getMemberships(): Promise<Membership[]> {
  const response = await authClient.get<unknown>('/club/members/memberships');

  const parsed = RawMembershipsResponseSchema.safeParse(response.data);

  // Handle both paginated { items: [] } and plain array responses
  if (parsed.success) {
    return parsed.data.items.map(mapRawMembership);
  }

  // Fallback: try parsing as a plain array
  const arrayParsed = z.array(RawMembershipSchema).parse(response.data);
  return arrayParsed.map(mapRawMembership);
}

/**
 * GET /club/business-units
 * Returns camelCase BusinessUnitPrimitives[].
 */
export async function getBusinessUnits(): Promise<BusinessUnitPrimitives[]> {
  const response = await authClient.get<unknown>('/club/business-units');

  const parsed = RawBusinessUnitsResponseSchema.safeParse(response.data);

  // Handle both paginated { items: [] } and plain array responses
  if (parsed.success) {
    return parsed.data.items.map(mapRawBusinessUnit);
  }

  // Fallback: try parsing as a plain array
  const arrayParsed = z.array(RawBusinessUnitSchema).parse(response.data);
  return arrayParsed.map(mapRawBusinessUnit);
}
