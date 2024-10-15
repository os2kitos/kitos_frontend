import { EntityState } from '@ngrx/entity';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { OrganizationMasterDataRoles } from 'src/app/shared/models/organization/organization-master-data/organization-master-data-roles.model';
import { OrganizationMasterData } from 'src/app/shared/models/organization/organization-master-data/organization-master-data.model';
import { OrganizationPermissions } from 'src/app/shared/models/organization/organization-permissions.model';
import { Organization } from 'src/app/shared/models/organization/organization.model';

export interface OrganizationState extends EntityState<Organization> {
  total: number;
  isLoadingUsersQuery: boolean;
  gridState: GridState;
  gridColumns: GridColumn[];

  organizationMasterData: OrganizationMasterData | null;
  organizationMasterDataRoles: OrganizationMasterDataRoles | null;
  permissions: OrganizationPermissions | null | undefined;
}
