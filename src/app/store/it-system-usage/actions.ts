import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  APIItSystemUsageResponseDTO,
  APIJournalPeriodDTO,
  APIOutgoingSystemRelationResponseDTO,
  APIResourcePermissionsResponseDTO,
  APISystemRelationWriteRequestDTO,
  APIUpdateItSystemUsageRequestDTO,
} from 'src/app/api/v2';
import { ExternalReferenceProperties } from 'src/app/shared/models/external-references/external-reference-properties.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITSystemUsage } from 'src/app/shared/models/it-system/it-system-usage/it-system-usage.model';

export const ITSystemUsageActions = createActionGroup({
  source: 'ITSystemUsage',
  events: {
    'Get IT System Usages': (odataString: string) => ({ odataString }),
    'Get IT System Usages Success ': (itSystemUsages: ITSystemUsage[], total: number) => ({ itSystemUsages, total }),
    'Get IT System Usages Error': emptyProps(),

    'Update Grid State': (gridState: GridState) => ({ gridState }),

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
  },
});
