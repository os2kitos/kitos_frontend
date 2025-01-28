import { createSelector, MemoizedSelector } from '@ngrx/store';
import { memoize } from 'lodash';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { organizationAdapter, organizationFeature } from './reducer';
import { OrganizationState } from './state';

export const { selectOrganizationState } = organizationFeature;

export const selectOrganizationMasterData = createSelector(selectOrganizationState, (state: OrganizationState) => {
  return state?.organizationMasterData ?? { uuid: '', name: '' };
});

export const selectOrganizationMasterDataRoles = createSelector(selectOrganizationState, (state: OrganizationState) => {
  return state?.organizationMasterDataRoles ?? masterDataRolesEmptyState;
});

export const selectOrganizationHasModifyPermission = createSelector(
  selectOrganizationState,
  (state) => state.permissions?.modify
);

export const selectOrganizationHasModifyCvrPermission = createSelector(
  selectOrganizationState,
  (state) => state.permissions?.modifyCvr
);

const masterDataRolesEmptyState = {
  organizationUuid: '',
  ContactPerson: { lastName: '', phoneNumber: '', name: '', email: '', id: null },
  DataResponsible: { cvr: '', phone: '', address: '', name: '', email: '', id: null },
  DataProtectionAdvisor: { cvr: '', phone: '', address: '', name: '', email: '', id: null },
};

export const selectAll = createSelector(selectOrganizationState, organizationAdapter.getSelectors().selectAll);
export const selectTotal = createSelector(selectOrganizationState, (state) => state.total);
export const selectOrganizationGridLoading = createSelector(
  selectOrganizationState,
  (state) => state.isLoadingUsersQuery
);
export const selectOrganizationGridState = createSelector(selectOrganizationState, (state) => state.gridState);
export const selectPreviousGridState = createSelector(selectOrganizationState, (state) => state.previousGridState);
export const selectOrganizationGridData = createSelector(selectAll, selectTotal, (data, total) => ({
  data,
  total,
}));
export const selectOrganizationGridColumns = createSelector(selectOrganizationState, (state) => state.gridColumns);

export const selectUIRootConfig = createSelector(selectOrganizationState, (state) => state.uiRootConfig);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectHasValidUIRootConfigCache: () => MemoizedSelector<any, boolean> = memoize(() =>
  createSelector(
    selectOrganizationState,
    () => new Date(),
    (state, now) => hasValidCache(state.uiRootConfigCacheTime, now)
  )
);

export const selectModuleVisibility = (configKey: UIModuleConfigKey) => {
  switch (configKey) {
    case UIModuleConfigKey.ItSystemUsage:
      return selectShowItSystemModule;
    case UIModuleConfigKey.ItContract:
      return selectShowItContractModule;
    case UIModuleConfigKey.DataProcessingRegistrations:
      return selectShowDataProcessingRegistrations;
    default:
      throw new Error(`Unknown config key: ${configKey}`);
  }
};

export const selectShowItSystemModule = createSelector(
  selectOrganizationState,
  (state) => state.uiRootConfig?.showItSystemModule ?? false
);
export const selectShowItContractModule = createSelector(
  selectOrganizationState,
  (state) => state.uiRootConfig?.showItContractModule ?? false
);

export const selectShowDataProcessingRegistrations = createSelector(
  selectOrganizationState,
  (state) => state.uiRootConfig?.showDataProcessing ?? false
);
