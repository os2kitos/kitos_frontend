export interface OrganizationPermissions {
  read?: boolean;
  modify?: boolean;
  delete?: boolean;
  modifyCvr?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptOrganizationPermissions(source: any) {
  return {
    read: source.read,
    modify: source.modify,
    delete: source.delete,
    modifyCvr: source.modifyCvr,
  };
}
