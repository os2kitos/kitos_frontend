export interface ShallowOrganization {
  uuid: string;
  name?: string;
  cvr?: string;
}

export function adaptShallowOrganization(source: any): ShallowOrganization | undefined {
  if (!source.uuid) {
    throw new Error('Invalid shallow organization source: missing uuid');
  }
  return {
    uuid: source.uuid,
    name: source.name,
    cvr: source.cvr,
  };
}
