import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { OrganizationUnitActions } from './actions';
import { OrganizationUnitState } from './state';

export const organizationUnitAdapter = createEntityAdapter<APIOrganizationUnitResponseDTO>({
  selectId: (organizationUnit) => organizationUnit.uuid,
});

export const organizationUnitInitialState: OrganizationUnitState = organizationUnitAdapter.getInitialState({
  isLoaded: false,
});

export const organizationUnitFeature = createFeature({
  name: 'OrganizationUnit',
  reducer: createReducer(
    organizationUnitInitialState,
    on(OrganizationUnitActions.getOrganizationUnits, (state): OrganizationUnitState => ({ ...state, isLoaded: false })),
    on(
      OrganizationUnitActions.getOrganizationUnitsSuccess,
      (state, { units }): OrganizationUnitState => ({
        ...organizationUnitAdapter.setAll(units, state),
        isLoaded: true,
      })
    ),
    on(
      OrganizationUnitActions.getOrganizationUnitsError,
      (state): OrganizationUnitState => ({ ...state, isLoaded: false })
    )
  ),
});
