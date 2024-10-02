export interface OrganizationMasterDataRoles {
  OrganizationUuid: string;
  ContactPerson: MasterDataContactPerson;
  DataResponsible: MasterDataDataResponsible;
  DataProtectionAdvisor: MasterDataDataProtectionAdvisor;
}

export const adaptOrganizationMasterDataRoles =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (source: any): OrganizationMasterDataRoles | undefined => {
    if (!source.organizationUuid) return;

    const sourceContactPerson = source.contactPerson;
    const contactPerson: MasterDataContactPerson = adaptContactPerson(sourceContactPerson);

    const sourceDataResponsible = source.dataResponsible;
    const dataResponsible: MasterDataDataResponsible = adaptDataResponsible(sourceDataResponsible);

    const sourceDataProtectionAdvisor = source.dataProtectionAdvisor;
    const dataProtectionAdvisor: MasterDataDataProtectionAdvisor =
      adaptDataProtectionAdvisor(sourceDataProtectionAdvisor);

    return {
      OrganizationUuid: source.organizationUuid,
      ContactPerson: contactPerson,
      DataResponsible: dataResponsible,
      DataProtectionAdvisor: dataProtectionAdvisor,
    };
  };

interface MasterDataContactPerson {
  lastName?: string;
  phoneNumber?: string;
  name?: string;
  email?: string;
  id?: number;
}

interface MasterDataDataResponsible {
  cvr?: string;
  phone?: string;
  address?: string;
  name?: string;
  email?: string;
  id?: number;
}

interface MasterDataDataProtectionAdvisor {
  cvr?: string;
  phone?: string;
  address?: string;
  name?: string;
  email?: string;
  id?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptContactPerson(sourceContactPerson: any) {
  const contactPerson: MasterDataContactPerson = {};
  if (sourceContactPerson) {
    (contactPerson.lastName = sourceContactPerson.lastName),
      (contactPerson.phoneNumber = sourceContactPerson.phoneNumber),
      (contactPerson.email = sourceContactPerson.email),
      (contactPerson.name = sourceContactPerson.name),
      (contactPerson.id = sourceContactPerson.id);
  }
  return contactPerson;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptDataResponsible(sourceDataResponsible: any) {
  const dataResponsible: MasterDataDataResponsible = {};

  if (sourceDataResponsible) {
    dataResponsible.cvr = sourceDataResponsible.cvr;
    dataResponsible.phone = sourceDataResponsible.phone;
    dataResponsible.address = sourceDataResponsible.address;
    dataResponsible.name = sourceDataResponsible.name;
    dataResponsible.email = sourceDataResponsible.email;
    dataResponsible.id = sourceDataResponsible.id;
  }
  return dataResponsible;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptDataProtectionAdvisor(sourceDataProtectionAdvisor: any) {
  const dataProtectionAdvisor: MasterDataDataProtectionAdvisor = {};

  if (sourceDataProtectionAdvisor) {
    dataProtectionAdvisor.cvr = sourceDataProtectionAdvisor.cvr;
    dataProtectionAdvisor.phone = sourceDataProtectionAdvisor.phone;
    dataProtectionAdvisor.address = sourceDataProtectionAdvisor.address;
    dataProtectionAdvisor.name = sourceDataProtectionAdvisor.name;
    dataProtectionAdvisor.email = sourceDataProtectionAdvisor.email;
    dataProtectionAdvisor.id = sourceDataProtectionAdvisor.id;
  }
  return dataProtectionAdvisor;
}
