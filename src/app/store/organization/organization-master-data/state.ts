import { OrganizationMasterData } from "src/app/shared/models/organization/organization-master-data/organizationMasterData.model";
import { OrganizationMasterDataRoles } from "src/app/shared/models/organization/organization-master-data/organizationMasterDataRoles.model";

export interface OrganizationMasterDataState {
  organizationMasterData: OrganizationMasterData | null;
  masterDataRoles: OrganizationMasterDataRoles | null;
}
