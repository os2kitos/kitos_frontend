import { createSelector } from '@ngrx/store';
import { organizationUserAdapter, organizationUserFeature } from './reducer';

const { selectOrganizationUserState } = organizationUserFeature;

export const selectAll = createSelector(selectOrganizationUserState, organizationUserAdapter.getSelectors().selectAll);
export const selectTotal = createSelector(selectOrganizationUserState, (state) => state.total);
export const selectOrganizationUserGridLoading = createSelector(
  selectOrganizationUserState,
  (state) => state.isLoadingUsersQuery
);
export const selectOrganizationUserGridState = createSelector(selectOrganizationUserState, (state) => state.gridState);
export const selectOrganizationUserGridData = createSelector(selectAll, selectTotal, (data, total) => ({
  data,
  total,
}));
export const selectOrganizationUserGridColumns = createSelector(
  selectOrganizationUserState,
  (state) => state.gridColumns
);

export const selectOrganizationUserByIndex = (index: number) =>
  createSelector(selectAll, (organizationUsers) => organizationUsers[index]);

export const selectOrganizationUserPermissions = createSelector(selectOrganizationUserState, (state) => state.permissions);
