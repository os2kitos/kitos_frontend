import {
  APIInterfacesExposedOutsideTheOrganizationResponseDTO,
  APIMultipleConflictsResponseDTO,
  APIOrganizationRemovalConflictsResponseDTO,
  APISimpleConflictResponseDTO,
  APISystemWithUsageOutsideOrganizationConflictResponseDTO,
} from 'src/app/api/v2';
import { RemovalConflict } from 'src/app/modules/global-admin/global-admin-organizations/organizations-dialogs/delete-organization-dialog/removal-conflict-table/removal-conflict-table.component';
import { OrganizationRemovalConflicts } from '../models/global-admin/organization-removal-conflicts.model';

export function mapConflictsDtoToOrganizationRemovalConflicts(
  conflictsDto: APIOrganizationRemovalConflictsResponseDTO
): OrganizationRemovalConflicts {
  const conflicts: OrganizationRemovalConflicts = {
    contractsInOtherOrganizationsWhereOrgIsSupplier:
      conflictsDto.contractsInOtherOrganizationsWhereOrgIsSupplier?.map(mapSimpleConflictToTableItem) ?? [],
    dprInOtherOrganizationsWhereOrgIsDataProcessor:
      conflictsDto.dprInOtherOrganizationsWhereOrgIsDataProcessor?.map(mapSimpleConflictToTableItem) ?? [],
    dprInOtherOrganizationsWhereOrgIsSubDataProcessor:
      conflictsDto.dprInOtherOrganizationsWhereOrgIsSubDataProcessor?.map(mapSimpleConflictToTableItem) ?? [],
    interfacesExposedOnSystemsOutsideTheOrganization:
      conflictsDto.interfacesExposedOnSystemsOutsideTheOrganization?.map(
        mapInterfacesExposedOutsideTheOrganizationToTableItem
      ) ?? [],
    systemsExposingInterfacesDefinedInOtherOrganizations:
      conflictsDto.systemsExposingInterfacesDefinedInOtherOrganizations?.flatMap(mapMultipleConflictsToTableItem) ?? [],
    systemsInOtherOrganizationsWhereOrgIsRightsHolder:
      conflictsDto.systemsInOtherOrganizationsWhereOrgIsRightsHolder?.map(mapSimpleConflictToTableItem) ?? [],
    systemsSetAsParentSystemToSystemsInOtherOrganizations:
      conflictsDto.systemsSetAsParentSystemToSystemsInOtherOrganizations?.flatMap(mapMultipleConflictsToTableItem) ??
      [],
    systemsWhereOrgIsArchiveSupplier:
      conflictsDto.systemsWhereOrgIsArchiveSupplier?.map(mapSimpleConflictToTableItem) ?? [],
    systemsWithUsagesOutsideTheOrganization:
      conflictsDto.systemsWithUsagesOutsideTheOrganization?.flatMap(
        mapSystemUsageOutsideOrganizationConflictToTableItem
      ) ?? [],
  };
  return conflicts;
}
function mapSimpleConflictToTableItem(conflict: APISimpleConflictResponseDTO): RemovalConflict {
  return {
    mainEntityName: undefined,
    entityName: conflict.entityName ?? '',
    organizationName: conflict.organizationName ?? '',
  };
}

function mapMultipleConflictsToTableItem(multiConflict: APIMultipleConflictsResponseDTO): RemovalConflict[] {
  return (multiConflict.conflicts ?? [])
    .map(mapSimpleConflictToTableItem)
    .map((conflict) => ({ ...conflict, mainEntityName: multiConflict.mainEntityName }));
}

function mapSystemUsageOutsideOrganizationConflictToTableItem(
  conflict: APISystemWithUsageOutsideOrganizationConflictResponseDTO
): RemovalConflict[] {
  return (conflict.organizationNames ?? []).map((organizationName) => ({
    mainEntityName: undefined,
    entityName: conflict.systemName ?? '',
    organizationName: organizationName ?? '',
  }));
}

function mapInterfacesExposedOutsideTheOrganizationToTableItem(
  conflict: APIInterfacesExposedOutsideTheOrganizationResponseDTO
): RemovalConflict {
  return {
    mainEntityName: conflict.exposedInterfaceName,
    entityName: conflict.exposingSystemName ?? '',
    organizationName: conflict.organizationName ?? '',
  };
}
