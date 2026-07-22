import { APIOrganizationRole, APIOrganizationRightDTO } from 'src/app/api/v1';

export interface OrganizationRight {
  organizationUuid?: string;
  role: string;
}

// The V1 API may return numeric enum values for legacy reasons; this map converts them to their string equivalents.
const numericToStringRoleMap: Partial<Record<number, APIOrganizationRole>> = {
  0: APIOrganizationRole.User,
  1: APIOrganizationRole.LocalAdmin,
  2: APIOrganizationRole.OrganizationModuleAdmin,
  3: APIOrganizationRole.SystemModuleAdmin,
  4: APIOrganizationRole.ContractModuleAdmin,
  5: APIOrganizationRole.GlobalAdmin,
  6: APIOrganizationRole.RightsHolderAccess,
};

function normalizeRole(rawRole: unknown): string {
  if (typeof rawRole === 'number') {
    return numericToStringRoleMap[rawRole] ?? String(rawRole);
  }
  return rawRole as string;
}

export function adaptV1OrganizationRights(rights: Array<APIOrganizationRightDTO>): OrganizationRight[] {
  return rights.map((right) => ({
    organizationUuid: right.organizationUuid,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    role: normalizeRole((right as any).role),
  }));
}
