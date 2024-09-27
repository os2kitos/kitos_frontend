export interface OrganizationUser {
  id: string;
  Uuid: string;
  Name: string;
  Email: string;
  LastAdvisSent: Date;
  ObjectOwner: { Name: string };
  HasApiAccess: boolean;
  HasStakeHolderAccess: boolean;
  HasRightsHolderAccess: boolean;
  IsLocalAdmin: boolean;
  IsOrganizationModuleAdmin: boolean;
  IsContractModuleAdmin: boolean;
  IsSystemModuleAdmin: boolean;
  Roles: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptOrganizationUser = (value: any): OrganizationUser | undefined => {
  if (!value.Uuid) return;

  const roles = value.OrganizationUnitRights.map((right: { Role: { Name: string } }) => right.Role?.Name)
    .filter((name: string) => name) // Filter out undefined or null names
    .join(', ');

  return {
    id: value.Uuid,
    Uuid: value.Uuid,
    Name: `${value.Name} ${value.LastName}`,
    Email: value.Email,
    LastAdvisSent: value.LastAdvisSent,
    ObjectOwner: { Name: `${value.ObjectOwner?.Name} ${value.ObjectOwner?.LastName}` },
    HasApiAccess: value.HasApiAccess,
    HasStakeHolderAccess: value.HasStakeHolderAccess,
    HasRightsHolderAccess: checkIfUserHasRole(rightsHolderAccessRole, value.OrganizationRights),
    IsLocalAdmin: checkIfUserHasRole(localAdminRole, value.OrganizationRights),
    IsOrganizationModuleAdmin: checkIfUserHasRole(organizationModuleAdminRole, value.OrganizationRights),
    IsContractModuleAdmin: checkIfUserHasRole(contractModuleAdminRole, value.OrganizationRights),
    IsSystemModuleAdmin: checkIfUserHasRole(systemModuleAdminRole, value.OrganizationRights),
    Roles: roles,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkIfUserHasRole(roleName: string, userRights: any[]): boolean {
  return userRights.map((x) => x.Role).includes(roleName);
}

const rightsHolderAccessRole = 'RightsHolderAccess';
const localAdminRole = 'LocalAdmin';
const organizationModuleAdminRole = 'OrganizationModuleAdmin';
const contractModuleAdminRole = 'ContractModuleAdmin';
const systemModuleAdminRole = 'SystemModuleAdmin';
