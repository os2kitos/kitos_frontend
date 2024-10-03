import { OrganizationMasterDataRoles } from 'src/app/shared/models/organization/organization-master-data/organization-master-data-roles.model';
import { OrganizationMasterData } from 'src/app/shared/models/organization/organization-master-data/organization-master-data.model';
import { OrganizationPermissions } from 'src/app/shared/models/organization/organization-permissions.model';

export interface OrganizationMasterDataState {
  organizationMasterData: OrganizationMasterData | null;
  organizationMasterDataRoles: OrganizationMasterDataRoles | null;
  permissions: OrganizationPermissions | null | undefined;
}
