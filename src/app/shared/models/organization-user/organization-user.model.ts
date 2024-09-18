export interface OrganizationUser {
  id: string;
  Uuid: string;
  Name: string;
  Email: string;
  LastAdvisSent: Date;
  ObjectOwner: { Name: string; LastName: string };
  HasApiAccess: boolean;
  HasStakeHolderAccess: boolean;
  HasRightsHolderAccess: boolean;
  IsLocalAdmin: boolean;
  IsOrganizationModuleAdmin: boolean;
  IsContractModuleAdmin: boolean;
  IsSystemModuleAdmin: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptOrganizationUser = (value: any): OrganizationUser | undefined => {
  if (!value.Uuid) return;

  return {
    id: value.Uuid,
    Uuid: value.Uuid,
    Name: `${value.Name} ${value.LastName}`,
    Email: value.Email,
    LastAdvisSent: value.LastAdvisSent,
    ObjectOwner: { Name: value.ObjectOwner?.Name, LastName: value.ObjectOwner?.LastName },
    HasApiAccess: value.HasApiAccess,
    HasStakeHolderAccess: value.HasStakeHolderAccess,
    HasRightsHolderAccess: checkIfUserHasRole('RightsHolderAccess', value.OrganizationRights),
    IsLocalAdmin: checkIfUserHasRole('LocalAdmin', value.OrganizationRights),
    IsOrganizationModuleAdmin: checkIfUserHasRole('OrganizationModuleAdmin', value.OrganizationRights),
    IsContractModuleAdmin: checkIfUserHasRole('ContractModuleAdmin', value.OrganizationRights),
    IsSystemModuleAdmin: checkIfUserHasRole('SystemModuleAdmin', value.OrganizationRights),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkIfUserHasRole(roleName: string, userRights: any[]): boolean {
  return userRights.map((x) => x.Role).includes(roleName);
}
