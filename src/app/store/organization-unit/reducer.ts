import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { EntityLoadingState } from 'src/app/shared/models/entity-loading-state.model';
import { OrganizationUnitActions } from './actions';
import { OrganizationUnitState } from './state';

export const organizationUnitAdapter = createEntityAdapter<APIOrganizationUnitResponseDTO>({
  selectId: (organizationUnit) => organizationUnit.uuid,
});

export const organizationUnitInitialState: OrganizationUnitState = organizationUnitAdapter.getInitialState({
  loadingState: EntityLoadingState.initial,
});

export const organizationUnitFeature = createFeature({
  name: 'OrganizationUnit',
  reducer: createReducer(
    organizationUnitInitialState,
    on(
      OrganizationUnitActions.getOrganizationUnits,
      (state): OrganizationUnitState => ({ ...state, loadingState: EntityLoadingState.loading })
    ),
    on(
      OrganizationUnitActions.getOrganizationUnitsSuccess,
      (state, { units }): OrganizationUnitState => ({
        ...organizationUnitAdapter.setAll(units, state),
        loadingState: EntityLoadingState.loaded,
      })
    ),
    on(
      OrganizationUnitActions.getOrganizationUnitsError,
      (state): OrganizationUnitState => ({ ...state, loadingState: EntityLoadingState.error })
    )
  ),
});
