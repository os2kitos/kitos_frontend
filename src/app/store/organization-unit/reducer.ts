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
    ),

    on(OrganizationUnitActions.deleteOrganizationUnitSuccess, (state, {uuid}): OrganizationUnitState => {
      const nodeToRemove = organizationUnitAdapter.getSelectors().selectAll(state).find((unit) => unit.uuid === uuid);
      if (!nodeToRemove) return state;
      const parent = organizationUnitAdapter.getSelectors().selectAll(state).find((unit) => unit.uuid === nodeToRemove.parentOrganizationUnit?.uuid);
      if (!parent) return state;
      const children = organizationUnitAdapter.getSelectors().selectAll(state).filter((unit) => unit.parentOrganizationUnit?.uuid === uuid);
      const removeChildren = organizationUnitAdapter.removeMany(children.map((unit) => unit.uuid), state);
      const removeNode = organizationUnitAdapter.removeOne(uuid, removeChildren);
      const newParentForChildren = children.map((unit) => ({ ...unit, parentOrganizationUnit: parent }));
      const addChildren = organizationUnitAdapter.addMany(newParentForChildren, removeNode);
      return addChildren;
    }),

    on(OrganizationUnitActions.createOrganizationSubunitSuccess, (state, { unit }): OrganizationUnitState => ({
      ...organizationUnitAdapter.addOne(unit, state),
    })),
  ),
});
