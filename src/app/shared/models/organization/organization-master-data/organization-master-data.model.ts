export interface OrganizationMasterData {
  cvr?: string;
  phone?: string;
  email?: string;
  address?: string;
  uuid: string;
  name: string;
}

export const adaptOrganizationMasterData =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (source: any): OrganizationMasterData | undefined => {
    if (!source.uuid) return;

    return {
      cvr: source.cvr,
      phone: source.phone,
      email: source.email,
      address: source.address,
      uuid: source.uuid!,
      name: source.name!,
    };
  };
