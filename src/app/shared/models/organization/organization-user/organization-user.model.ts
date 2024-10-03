import { mapStartPreferenceChoiceRaw, StartPreferenceChoice } from './start-preference.model';

export interface OrganizationUser {
  id: string;
  Uuid: string;
  Name: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Email: string;
  LastAdvisSent: string;
  ObjectOwner: { Name: string };
  HasApiAccess: boolean;
  HasStakeHolderAccess: boolean;
  HasRightsHolderAccess: boolean;
  IsLocalAdmin: boolean;
  IsOrganizationModuleAdmin: boolean;
  IsContractModuleAdmin: boolean;
  IsSystemModuleAdmin: boolean;
  DefaultStartPreference: StartPreferenceChoice | undefined;
  Roles: string;
  OrganizationUnitRights: Right[];
  ItSystemRights: Right[];
  ItContractRights: Right[];
  DataProcessingRegistrationRights: Right[];
}

export interface Right {
  role: { name: string; uuid: string, id: number };
  entity: { name: string; uuid: string };
  writeAccess: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptOrganizationUser = (value: any): OrganizationUser | undefined => {
  if (!value.Uuid) return;

  const roles = value.OrganizationUnitRights.map((right: { Role: { Name: string } }) => right.Role?.Name)
    .filter((name: string) => name) // Filter out undefined or null names
    .join(', ');

  const adaptedUser = {
    id: value.Uuid,
    Uuid: value.Uuid,
    Name: `${value.Name} ${value.LastName}`,
    FirstName: value.Name,
    LastName: value.LastName,
    PhoneNumber: value.PhoneNumber,
    Email: value.Email,
    LastAdvisSent: value.LastAdvisDate,
    ObjectOwner: { Name: value.ObjectOwner ? `${value.ObjectOwner?.Name} ${value.ObjectOwner?.LastName}` : 'Ingen' },
    HasApiAccess: value.HasApiAccess ?? false,
    HasStakeHolderAccess: value.HasStakeHolderAccess ?? false,
    DefaultStartPreference: mapStartPreferenceChoiceRaw(value.DefaultUserStartPreference),
    HasRightsHolderAccess: checkIfUserHasRole(rightsHolderAccessRole, value.OrganizationRights),
    IsLocalAdmin: checkIfUserHasRole(localAdminRole, value.OrganizationRights),
    IsOrganizationModuleAdmin: checkIfUserHasRole(organizationModuleAdminRole, value.OrganizationRights),
    IsContractModuleAdmin: checkIfUserHasRole(contractModuleAdminRole, value.OrganizationRights),
    IsSystemModuleAdmin: checkIfUserHasRole(systemModuleAdminRole, value.OrganizationRights),
    Roles: roles,
    OrganizationUnitRights: value.OrganizationUnitRights.map(adaptEntityRights),
    ItSystemRights: value.ItSystemRights.map(adaptItSystemRights),
    ItContractRights: value.ItContractRights.map(adaptEntityRights),
    DataProcessingRegistrationRights: value.DataProcessingRegistrationRights.map(adaptEntityRights),
  };

  return adaptedUser;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkIfUserHasRole(roleName: string, userRights: any[]): boolean {
  return userRights.map((x) => x.Role).includes(roleName);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptEntityRights(right: any): Right {
  return {
    role: { name: right.Role.Name, uuid: right.Role.Uuid, id: 0 }, //TODO
    entity: { name: right.Object.Name, uuid: right.Object.Uuid },
    writeAccess: right.Role.HasWriteAccess,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptItSystemRights(rights: any): Right {
  return {
    role: { name: rights.Role.Name, uuid: rights.Role.Uuid, id: 0 }, //TODO
    entity: { name: rights.Object.ItSystem.Name, uuid: rights.Object.Uuid },
    writeAccess: rights.Role.HasWriteAccess,
  };
}

const rightsHolderAccessRole = 'RightsHolderAccess';
const localAdminRole = 'LocalAdmin';
const organizationModuleAdminRole = 'OrganizationModuleAdmin';
const contractModuleAdminRole = 'ContractModuleAdmin';
const systemModuleAdminRole = 'SystemModuleAdmin';
