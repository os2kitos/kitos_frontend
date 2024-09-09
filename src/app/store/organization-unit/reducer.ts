import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { OrganizationUnitActions } from './actions';
import { OrganizationUnitState } from './state';

export const organizationUnitAdapter = createEntityAdapter<APIOrganizationUnitResponseDTO>({
  selectId: (organizationUnit) => organizationUnit.uuid,
});

export const organizationUnitInitialState: OrganizationUnitState = organizationUnitAdapter.getInitialState({
  cacheTime: undefined,
  expandedNodeUuids: [],
});

export const organizationUnitFeature = createFeature({
  name: 'OrganizationUnit',
  reducer: createReducer(
    organizationUnitInitialState,
    on(OrganizationUnitActions.getOrganizationUnits, (state): OrganizationUnitState => ({ ...state })),
    on(
      OrganizationUnitActions.getOrganizationUnitsSuccess,
      (state, { units }): OrganizationUnitState => ({
        ...organizationUnitAdapter.setAll(units, state),
        cacheTime: new Date().getTime(),
      })
    ),
    on(OrganizationUnitActions.getOrganizationUnitsError, (state): OrganizationUnitState => ({ ...state })),
    on(OrganizationUnitActions.updateHierarchy, (state, { unit, units }): OrganizationUnitState => {
      const nodesCopy = units.map((u) => (u.uuid === unit.uuid ? unit : u));

      return { ...organizationUnitAdapter.setAll(nodesCopy, state) };
    }),

    on(
      OrganizationUnitActions.addExpandedNode,
      (state, { uuid }): OrganizationUnitState => ({
        ...state,
        expandedNodeUuids: [...state.expandedNodeUuids, uuid],
      })
    ),
    on(
      OrganizationUnitActions.removeExpandedNode,
      (state, { uuid }): OrganizationUnitState => ({
        ...state,
        expandedNodeUuids: state.expandedNodeUuids.filter((u) => u !== uuid),
      })
    )
  ),
});
