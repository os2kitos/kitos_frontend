import { APIOrganizationRightDTO } from 'src/app/api/v1';

export interface OrganizationRight {
  organizationUuid?: string;
  role: number;
}

export function adaptV1OrganizationRights(rights: Array<APIOrganizationRightDTO>): OrganizationRight[] {
  return (
    rights.map((right) => ({
      organizationUuid: right.organizationUuid,
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      role: (right as any).role,
    })) ?? []
  );
}
