import { createSelector } from '@ngrx/store';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { GridData } from 'src/app/shared/models/grid-data.model';
import { mapIdentityNamePair } from 'src/app/shared/models/identity-name-pair.model';
import { mapDataSensitivityLevel } from 'src/app/shared/models/it-system-usage/gdpr/data-sensitivity-level.model';
import { mapSpecificPersonalData } from 'src/app/shared/models/it-system-usage/gdpr/specific-personal-data.model';
import { itSystemUsageAdapter, itSystemUsageFeature } from './reducer';

const { selectITSystemUsageState } = itSystemUsageFeature;

export const selectAll = createSelector(selectITSystemUsageState, itSystemUsageAdapter.getSelectors().selectAll);

export const selectTotal = createSelector(selectITSystemUsageState, (state) => state.total);
export const selectIsLoading = createSelector(selectITSystemUsageState, (state) => state.isLoadingSystemUsagesQuery);
export const selectGridState = createSelector(selectITSystemUsageState, (state) => state.gridState);

export const selectGridData = createSelector(selectAll, selectTotal, (data, total): GridData => ({ data, total }));
export const selectUsageGridColumns = createSelector(selectITSystemUsageState, (state) => state.gridColumns);
export const selectGridRoleColumns = createSelector(selectITSystemUsageState, (state) => state.gridRoleColumns);
export const selectOverviewSystemRoles = createSelector(selectITSystemUsageState, (state) => state.systemRoles);

export const selectItSystemUsage = createSelector(selectITSystemUsageState, (state) => state.itSystemUsage);
export const selectIsSystemUsageLoading = createSelector(
  selectITSystemUsageState,
  (state) => state.itSystemUsageLoading
);
export const selectItSystemUsageUuid = createSelector(selectItSystemUsage, (itSystemUsage) => itSystemUsage?.uuid);
export const selectItSystemUsageName = createSelector(
  selectItSystemUsage,
  (itSystemUsage) => itSystemUsage?.systemContext.name
);
export const selectItSystemUsageGeneral = createSelector(
  selectItSystemUsage,
  (itSystemUsage) => itSystemUsage?.general
);
export const selectItSystemUsageMainContract = createSelector(
  selectItSystemUsageGeneral,
  (general) => general?.mainContract
);
export const selectItSystemUsageValid = createSelector(
  selectItSystemUsage,
  (itSystemUsage) => itSystemUsage?.general.validity.valid
);
export const selectItSystemUsageValidAccordingToMainContract = createSelector(
  selectItSystemUsage,
  (itSystemUsage) => itSystemUsage?.general.validity.validAccordingToMainContract
);
export const selectItSystemUsageSystemContextUuid = createSelector(
  selectItSystemUsage,
  (itSystemUsage) => itSystemUsage?.systemContext.uuid
);

export const selectITSystemUsageHasReadPermission = createSelector(
  selectITSystemUsageState,
  (state) => state.permissions?.read
);
export const selectITSystemUsageHasModifyPermission = createSelector(
  selectITSystemUsageState,
  (state) => state.permissions?.modify
);
export const selectITSystemUsageHasDeletePermission = createSelector(
  selectITSystemUsageState,
  (state) => state.permissions?.delete
);

export const selectITSystemUsageHasCreateCollectionPermission = createSelector(
  selectITSystemUsageState,
  (state) => state.collectionPermissions?.create
);

export const selectITSystemUsageIsRemoving = createSelector(selectITSystemUsageState, (state) => state.isRemoving);

export const selectItSystemUsageContextSystemUuid = createSelector(
  selectItSystemUsage,
  (itSystemUsage) => itSystemUsage?.systemContext.uuid
);

export const selectItSystemUsageResponsibleUnit = createSelector(
  selectItSystemUsage,
  (itSystemUsage) => itSystemUsage?.organizationUsage?.responsibleOrganizationUnit
);

export const selectItSystemUsageUsingOrganizationUnits = createSelector(
  selectItSystemUsage,
  (itSystemUsage): APIIdentityNamePairResponseDTO[] =>
    itSystemUsage?.organizationUsage?.usingOrganizationUnits
      .slice()
      .sort((a: APIIdentityNamePairResponseDTO, b: APIIdentityNamePairResponseDTO) =>
        a.name.localeCompare(b.name)
      ) as APIIdentityNamePairResponseDTO[]
);

export const selectItSystemUsageLocallyAddedKleUuids = createSelector(
  selectItSystemUsage,
  (itSystemUsage): string[] =>
    itSystemUsage?.localKLEDeviations.addedKLE.map((kle: APIIdentityNamePairResponseDTO) => kle.uuid) as string[]
);

export const selectItSystemUsageLocallyRemovedKleUuids = createSelector(
  selectItSystemUsage,
  (itSystemUsage): string[] =>
    itSystemUsage?.localKLEDeviations.removedKLE.map((kle: APIIdentityNamePairResponseDTO) => kle.uuid) as string[]
);

export const selectItSystemUsageOutgoingSystemRelations = createSelector(
  selectItSystemUsage,
  (itSystemUsage) => itSystemUsage?.outgoingSystemRelations
);

export const selectItSystemUsageExternalReferences = createSelector(
  selectITSystemUsageState,
  (state) => state.itSystemUsage?.externalReferences
);

export const selectItSystemUsageGdpr = createSelector(selectItSystemUsage, (itSystemUsage) => itSystemUsage?.gdpr);

export const selectItSystemUsageGdprDataSensitivityLevels = createSelector(selectItSystemUsageGdpr, (gdpr) =>
  gdpr?.dataSensitivityLevels.map((level) => mapDataSensitivityLevel(level))
);

export const selectItSystemUsageGdprSpecificPersonalData = createSelector(selectItSystemUsageGdpr, (gdpr) =>
  gdpr?.specificPersonalData.map((type) => mapSpecificPersonalData(type))
);

export const selectItSystemUsageGdprSensitivePersonalData = createSelector(selectItSystemUsageGdpr, (gdpr) =>
  gdpr?.sensitivePersonData.map((type) => mapIdentityNamePair(type))
);

export const selectItSystemUsageGdprRegisteredDataCategories = createSelector(selectItSystemUsageGdpr, (gdpr) =>
  gdpr?.registeredDataCategories.map((category) => mapIdentityNamePair(category))
);

export const selectItSystemUsageArchiving = createSelector(
  selectItSystemUsage,
  (itSystemUsage) => itSystemUsage?.archiving
);

export const selectCurrentFilter = createSelector(selectITSystemUsageState, (state) => state.currentFilter);
