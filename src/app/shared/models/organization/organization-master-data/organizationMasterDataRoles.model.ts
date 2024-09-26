export interface OrganizationMasterDataRoles {
  ContactPerson: MasterDataContactPerson | null;
}

export const adaptOrganizationMasterDataRoles =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (source: any): OrganizationMasterDataRoles | undefined => {
    if (!source.organizationUuid) return;

    const sourceContactPerson = source.contactPerson;
    const contactPerson: MasterDataContactPerson = {};
    if (sourceContactPerson) {
      (contactPerson.lastName = sourceContactPerson.lastName),
        (contactPerson.phoneNumber = sourceContactPerson.phoneNumber),
        (contactPerson.email = sourceContactPerson.email),
        (contactPerson.name = sourceContactPerson.name),
        (contactPerson.id = sourceContactPerson.id);
    }
    //TODO add mapping for other 2 roles
    return {
      ContactPerson: contactPerson,
    };
  };

interface MasterDataContactPerson {
  lastName?: string;
  phoneNumber?: string;
  name?: string;
  email?: string;
  id?: number;
}
