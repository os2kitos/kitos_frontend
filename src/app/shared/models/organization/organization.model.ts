import { mapOrganizationType, OrganizationType } from "./organization-type.model";

export interface Organization {
  readonly organizationType: OrganizationType | undefined;
  readonly cvr?: string;
  uuid: string;
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptOrganization(source: any): Organization | undefined {
  if (!source.uuid) return undefined;
  return {
    uuid: source.uuid,
    name: source.name,
    cvr: source.cvr,
    organizationType: mapOrganizationType(source.organizationType),
  }
}
