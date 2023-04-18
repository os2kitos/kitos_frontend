import { createSelector } from '@ngrx/store';
import { GridData } from 'src/app/shared/models/grid-data.model';
import { ITSystemUsage } from 'src/app/shared/models/it-system-usage.model';
import { itSystemUsageAdapter, itSystemUsageFeature } from './reducer';

const { selectITSystemUsageState } = itSystemUsageFeature;

export const selectAll = createSelector(selectITSystemUsageState, itSystemUsageAdapter.getSelectors().selectAll);

export const selectTotal = createSelector(selectITSystemUsageState, (state) => state.total);
export const selectIsLoading = createSelector(selectITSystemUsageState, (state) => state.isLoading);
export const selectGridState = createSelector(selectITSystemUsageState, (state) => state.gridState);

export const selectGridData = createSelector(
  selectAll,
  selectTotal,
  (data, total): GridData<ITSystemUsage> => ({ data, total })
);

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

export const selectITSystemUsageIsRemoving = createSelector(selectITSystemUsageState, (state) => state.isRemoving);

export const selectItSystemUsageContextSystemUuid = createSelector(
  selectItSystemUsage,
  (itSystemUsage) => itSystemUsage?.systemContext.uuid
);

export const selectItSystemUsageResponsibleUnit = createSelector(
  selectItSystemUsage,
  (itSystemUsage) => itSystemUsage?.organizationUsage?.responsibleOrganizationUnit
);

export const selectItSystemUsageUsingOrganizationUnits = createSelector(selectItSystemUsage, (itSystemUsage) =>
  itSystemUsage?.organizationUsage?.usingOrganizationUnits.slice().sort((a, b) => a.name.localeCompare(b.name))
);
