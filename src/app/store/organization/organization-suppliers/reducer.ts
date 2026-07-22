import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ShallowOrganization } from 'src/app/shared/models/organization/shallow-organization.model';
import { OrganizationActions } from '../actions';
import { OrganizationSuppliersActions } from './actions';
import { OrganizationSuppliersState } from './state';

export const organizationSuppliersAdapter = createEntityAdapter<ShallowOrganization>();

export const organizationSuppliersInitialState: OrganizationSuppliersState =
  organizationSuppliersAdapter.getInitialState({
    suppliers: [],
    availableSuppliers: [],
    suppliersLoading: false,
    suppliersCacheTime: undefined,
    availableSuppliersCacheTime: undefined,
  });

export const organizationSuppliersFeature = createFeature({
  name: 'OrganizationSuppliers',
  reducer: createReducer(
    organizationSuppliersInitialState,
    on(OrganizationSuppliersActions.getOrganizationSuppliers, (state) => ({
      ...state,
      suppliersLoading: true,
    })),
    on(
      OrganizationSuppliersActions.getOrganizationSuppliersSuccess,
      (state, { suppliers }): OrganizationSuppliersState => ({
        ...state,
        suppliers,
        suppliersLoading: false,
        suppliersCacheTime: Date.now(),
      })
    ),
    on(OrganizationSuppliersActions.getOrganizationSuppliersError, (state) => ({ ...state, suppliersLoading: false })),
    on(OrganizationSuppliersActions.addOrganizationSupplierSuccess, (state) => ({
      ...state,
      suppliersCacheTime: undefined,
      availableSuppliersCacheTime: undefined,
    })),
    on(OrganizationSuppliersActions.removeOrganizationSupplierSuccess, (state) => ({
      ...state,
      suppliersCacheTime: undefined,
      availableSuppliersCacheTime: undefined,
    })),
    on(
      OrganizationSuppliersActions.getAvailableOrganizationSuppliersSuccess,
      (state, { availableSuppliers }): OrganizationSuppliersState => ({
        ...state,
        availableSuppliers,
        availableSuppliersCacheTime: Date.now(),
      })
    ),
    on(OrganizationActions.patchOrganizationSuccess, (state) => ({
      ...state,
      suppliersCacheTime: undefined,
      availableSuppliersCacheTime: undefined,
    }))
  ),
});
