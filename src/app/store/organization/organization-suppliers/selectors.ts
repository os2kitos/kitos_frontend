import { createSelector } from '@ngrx/store';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { organizationSuppliersFeature } from './reducer';

export const { selectOrganizationSuppliersState } = organizationSuppliersFeature;

export const selectOrganizationSuppliers = createSelector(selectOrganizationSuppliersState, (state) => state.suppliers);
export const selectOrganizationSuppliersLoading = createSelector(
  selectOrganizationSuppliersState,
  (state) => state.suppliersLoading
);
export const selectOrganizationSuppliersHasValidCache = createSelector(selectOrganizationSuppliersState, (state) => {
  const cacheTime = state.suppliersCacheTime;
  return hasValidCache(cacheTime, new Date());
});
export const selectAvailableOrganizationSuppliersHasValidCache = createSelector(
  selectOrganizationSuppliersState,
  (state) => {
    const cacheTime = state.availableSuppliersCacheTime;
    return hasValidCache(cacheTime, new Date());
  }
);
export const selectAvailableOrganizationSuppliers = createSelector(
  selectOrganizationSuppliersState,
  (state) => state.availableSuppliers
);
