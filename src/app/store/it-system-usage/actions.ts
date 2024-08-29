import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIBusinessRoleDTO } from 'src/app/api/v1';
import {
  APIItSystemUsageResponseDTO,
  APIJournalPeriodDTO,
  APIOutgoingSystemRelationResponseDTO,
  APIResourceCollectionPermissionsResponseDTO,
  APIResourcePermissionsResponseDTO,
  APISystemRelationWriteRequestDTO,
  APIUpdateItSystemUsageRequestDTO,
} from 'src/app/api/v2';
import { ExternalReferenceProperties } from 'src/app/shared/models/external-references/external-reference-properties.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { SavedFilterState } from 'src/app/shared/models/grid/saved-filter-state.model';
import { ITSystemUsage } from 'src/app/shared/models/it-system-usage/it-system-usage.model';

export const ITSystemUsageActions = createActionGroup({
  source: 'ITSystemUsage',
  events: {
    'Get IT System Usages': (odataString: string) => ({ odataString }),
    'Get IT System Usages Success ': (itSystemUsages: ITSystemUsage[], total: number) => ({ itSystemUsages, total }),
    'Get IT System Usages Error': emptyProps(),

    'Update Grid State': (gridState: GridState) => ({ gridState }),
    'Update Grid Columns': (gridColumns: GridColumn[]) => ({ gridColumns }),
    'Update Grid Columns Success': (gridColumns: GridColumn[]) => ({ gridColumns }),
    'Update Grid Columns And Role Columns': (gridColumns: GridColumn[], gridRoleColumns: GridColumn[]) => ({
      gridColumns,
      gridRoleColumns,
    }),
    'Update Grid Columns And Role Columns Success': (gridColumns: GridColumn[]) => ({ gridColumns }),

    'Get It System Usage Overview Roles': () => emptyProps(),
    'Get It System Usage Overview Roles Success': (roles: APIBusinessRoleDTO[] | undefined) => ({ roles }),
    'Get It System Usage Overview Roles Error': emptyProps(),

    'Get IT System Usage': (systemUsageUuid: string) => ({ systemUsageUuid }),
    'Get IT System Usage Success ': (itSystemUsage?: APIItSystemUsageResponseDTO) => ({ itSystemUsage }),
    'Get IT System Usage Error': emptyProps(),

    'Remove IT System Usage': emptyProps(),
    'Remove IT System Usage Success ': emptyProps(),
    'Remove IT System Usage Error': emptyProps(),

    'Patch IT System Usage': (
      itSystemUsage: APIUpdateItSystemUsageRequestDTO,
      customSuccessText?: string,
      customErrorText?: string
    ) => ({
      itSystemUsage,
      customSuccessText,
      customErrorText,
    }),
    'Patch IT System Usage Success ': (itSystemUsage: APIItSystemUsageResponseDTO, customSuccessText?: string) => ({
      itSystemUsage,
      customSuccessText,
    }),
    'Patch IT System Usage Error': (customErrorText?: string) => ({ customErrorText }),

    'Remove IT System Usage Using Unit': (usingUnitToRemoveUuid: string) => ({ usingUnitToRemoveUuid }),
    'Remove IT System Usage Using Unit Success': (itSystemUsage: APIItSystemUsageResponseDTO) => ({ itSystemUsage }),
    'Remove IT System Usage Using Unit Error': emptyProps(),

    'Get IT System Usage Permissions': (systemUsageUuid: string) => ({ systemUsageUuid }),
    'Get IT System Usage Permissions Success ': (permissions?: APIResourcePermissionsResponseDTO) => ({
      permissions,
    }),
    'Get IT System Usage Permissions Error': emptyProps(),

    'Get IT System Usage Collection Permissions': emptyProps(),
    'Get IT System Usage Collection Permissions Success ': (
      permissions?: APIResourceCollectionPermissionsResponseDTO
    ) => ({ permissions }),
    'Get IT System Usage Collection Permissions Error': emptyProps(),

    'Add It System Usage Role': (userUuid: string, roleUuid: string) => ({ userUuid, roleUuid }),
    'Add It System Usage Role Success': (itSystemUsage: APIItSystemUsageResponseDTO) => ({ itSystemUsage }),
    'Add It System Usage Role Error': emptyProps(),

    'Remove It System Usage Role': (userUuid: string, roleUuid: string) => ({ userUuid, roleUuid }),
    'Remove It System Usage Role Success': (itSystemUsage: APIItSystemUsageResponseDTO) => ({ itSystemUsage }),
    'Remove It System Usage Role Error': emptyProps(),
    'Add Local KLE': (kleUuid: string) => ({
      kleUuid,
    }),
    'Remove Local KLE': (kleUuid: string) => ({
      kleUuid,
    }),
    'Remove Inherited KLE': (kleUuid: string) => ({
      kleUuid,
    }),
    'Restore Inherited KLE': (kleUuid: string) => ({
      kleUuid,
    }),
    'Add It System Usage Relation': (request: APISystemRelationWriteRequestDTO) => ({ request }),
    'Add It System Usage Relation Success': (
      itSystemUsageUuid: string,
      relation: APIOutgoingSystemRelationResponseDTO
    ) => ({ itSystemUsageUuid, relation }),
    'Add It System Usage Relation Error': emptyProps(),
    'Patch It System Usage Relation': (relationUuid: string, request: APISystemRelationWriteRequestDTO) => ({
      relationUuid,
      request,
    }),
    'Patch It System Usage Relation Success': (
      itSystemUsageUuid: string,
      relation: APIOutgoingSystemRelationResponseDTO
    ) => ({ itSystemUsageUuid, relation }),
    'Patch It System Usage Relation Error': emptyProps(),
    'Remove It System Usage Relation': (relationUuid: string) => ({ relationUuid }),
    'Remove It System Usage Relation Success': (itSystemUsageUuid: string) => ({ itSystemUsageUuid }),
    'Remove It System Usage Relation Error': emptyProps(),
    'Remove External Reference': (referenceUuid: string) => ({ referenceUuid }),
    'Remove External Reference Success': (itSystemUsage: APIItSystemUsageResponseDTO) => ({ itSystemUsage }),
    'Remove External Reference Error': () => emptyProps(),
    'Add External Reference': (externalReference: ExternalReferenceProperties) => ({ externalReference }),
    'Add External Reference Success': (itSystemUsage: APIItSystemUsageResponseDTO) => ({ itSystemUsage }),
    'Add External Reference Error': () => emptyProps(),
    'Edit External Reference': (referenceUuid: string, externalReference: ExternalReferenceProperties) => ({
      referenceUuid,
      externalReference,
    }),
    'Edit External Reference Success': (itSystemUsage: APIItSystemUsageResponseDTO) => ({ itSystemUsage }),
    'Edit External Reference Error': () => emptyProps(),
    'Remove It System Usage Journal Period': (journalPeriodUuid: string) => ({ journalPeriodUuid }),
    'Remove It System Usage Journal Period Success': (itSystemUsageUuid: string) => ({ itSystemUsageUuid }),
    'Remove It System Usage Journal Period Error': emptyProps(),
    'Add It System Usage Journal Period': (journalPeriod: APIJournalPeriodDTO) => ({
      journalPeriod,
    }),
    'Add It System Usage Journal Period Success': (itSystemUsageUuid: string) => ({ itSystemUsageUuid }),
    'Add It System Usage Journal Period Error': emptyProps(),
    'Patch It System Usage Journal Period': (journalPeriodUuid: string, journalPeriod: APIJournalPeriodDTO) => ({
      journalPeriodUuid,
      journalPeriod,
    }),
    'Patch It System Usage Journal Period Success': (itSystemUsageUuid: string) => ({
      itSystemUsageUuid,
    }),
    'Patch It System Usage Journal Period Error': emptyProps(),

    'Create It System Usage': (itSystemUuid: string) => ({ itSystemUuid }),
    'Create It System Usage Success': (itSystemUuid: string, usageUuid: string) => ({ itSystemUuid, usageUuid }),
    'Create It System Usage Error': emptyProps(),

    'Delete It System Usage By It System And Organization': (itSystemUuid: string) => ({ itSystemUuid }),
    'Delete It System Usage By It System And Organization Success': (itSystemUuid: string) => ({ itSystemUuid }),
    'Delete It System Usage By It System And Organization Error': emptyProps(),

    'Save IT System Usage Filter': (localStoreKey: string) => ({ localStoreKey }),
    'Apply IT System Usage Filter': (state: SavedFilterState) => ({ state }),

    'Save Organizational IT System Usage Column Configuration': () => emptyProps(),
    'Save Organizational IT System Usage Column Configuration Success': () => emptyProps(),
    'Save Organizational IT System Usage Column Configuration Error': () => emptyProps(),

    'Delete Organizational IT System Usage Column Configuration': () => emptyProps(),
    'Delete Organizational IT System Usage Column Configuration Success': () => emptyProps(),
    'Delete Organizational IT System Usage Column Configuration Error': () => emptyProps(),

    'Reset Organization IT System Usage Column Configuration': () => emptyProps(),
    'Reset Organization IT System Usage Column Configuration Success': () => emptyProps(), //This should contain the columns config that was retrieved from the API call
    'Reset Organization IT System Usage Column Configuration Error': () => emptyProps(),
  },
});
