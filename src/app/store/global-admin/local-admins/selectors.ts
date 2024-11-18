import { createSelector } from '@ngrx/store';
import { localAdminUsersAdapter, localAdminUsersFeature } from './reducers';

const { selectLocalAdminUsersState } = localAdminUsersFeature;

export const selectAllLocalAdmins = createSelector(
  selectLocalAdminUsersState,
  localAdminUsersAdapter.getSelectors().selectAll
);

export const selectLocalAdminsLoading = createSelector(selectLocalAdminUsersState, (state) => state.loading);
