import { OrganizationMasterDataPermissions } from 'src/app/shared/models/organization/organization-master-data/organization-master-data-permissions.model';
import { OrganizationMasterDataRoles } from 'src/app/shared/models/organization/organization-master-data/organization-master-data-roles.model';
import { OrganizationMasterData } from 'src/app/shared/models/organization/organization-master-data/organization-master-data.model';

export interface OrganizationMasterDataState {
  organizationMasterData: OrganizationMasterData | null;
  organizationMasterDataRoles: OrganizationMasterDataRoles | null;
  masterDataPermissions: OrganizationMasterDataPermissions | null;
}
