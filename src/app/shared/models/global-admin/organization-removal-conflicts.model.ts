import { RemovalConflict } from 'src/app/modules/global-admin/global-admin-organizations/organizations-dialogs/delete-organization-dialog/removal-conflict-table/removal-conflict-table.component';

export interface OrganizationRemovalConflicts {
  contractsInOtherOrganizationsWhereOrgIsSupplier: RemovalConflict[];
  dprInOtherOrganizationsWhereOrgIsDataProcessor: RemovalConflict[];
  dprInOtherOrganizationsWhereOrgIsSubDataProcessor: RemovalConflict[];
  systemsExposingInterfacesDefinedInOtherOrganizations: RemovalConflict[];
  systemsSetAsParentSystemToSystemsInOtherOrganizations: RemovalConflict[];
  systemsInOtherOrganizationsWhereOrgIsRightsHolder: RemovalConflict[];
  systemsWhereOrgIsArchiveSupplier: RemovalConflict[];
  interfacesExposedOnSystemsOutsideTheOrganization: RemovalConflict[];
  systemsWithUsagesOutsideTheOrganization: RemovalConflict[];
}
