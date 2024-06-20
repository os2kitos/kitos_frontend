import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { APIItInterfaceResponseDTO } from 'src/app/api/v2';
import { defaultGridState } from 'src/app/shared/models/grid-state.model';
import { ITInterface } from 'src/app/shared/models/it-interface/it-interface.model';
import { ITInterfaceActions } from './actions';
import { ITInterfaceState } from './state';

export const itInterfaceAdapter = createEntityAdapter<ITInterface>();

export const itInterfaceInitialState: ITInterfaceState = itInterfaceAdapter.getInitialState({
  total: 0,
  isLoadingInterfacesQuery: false,
  gridState: defaultGridState,
  gridColumns: [],

  loading: undefined,
  itInterface: undefined,

  isRemoving: false,

  permissions: undefined,
  collectionPermissions: undefined,

  isLoadingInterfaceDataRows: false,

  cacheTime: undefined,
});

export const itInterfaceFeature = createFeature({
  name: 'ITInterface',
  reducer: createReducer(
    itInterfaceInitialState,
    on(ITInterfaceActions.getITInterfaces, (state): ITInterfaceState => ({ ...state, isLoadingInterfacesQuery: true })),
    on(
      ITInterfaceActions.getITInterfacesSuccess,
      (state, { itInterfaces, total }): ITInterfaceState => ({
        ...itInterfaceAdapter.setAll(itInterfaces, state),
        total,
        isLoadingInterfacesQuery: false,
      })
    ),
    on(
      ITInterfaceActions.getITInterfacesError,
      (state): ITInterfaceState => ({ ...state, isLoadingInterfacesQuery: false })
    ),

    on(
      ITInterfaceActions.getITInterface,
      (state): ITInterfaceState => ({ ...state, itInterface: undefined, loading: true })
    ),
    on(
      ITInterfaceActions.getITInterfaceSuccess,
      (state, { itInterface }): ITInterfaceState => ({ ...state, itInterface, loading: false })
    ),

    on(
      ITInterfaceActions.getITInterfacePermissions,
      (state): ITInterfaceState => ({ ...state, permissions: undefined })
    ),
    on(
      ITInterfaceActions.getITInterfacePermissionsSuccess,
      (state, { permissions }): ITInterfaceState => ({ ...state, permissions })
    ),
    on(
      ITInterfaceActions.getITInterfaceCollectionPermissions,
      (state): ITInterfaceState => ({ ...state, collectionPermissions: undefined })
    ),
    on(
      ITInterfaceActions.getITInterfaceCollectionPermissionsSuccess,
      (state, { collectionPermissions }): ITInterfaceState => ({ ...state, collectionPermissions })
    ),

    on(
      ITInterfaceActions.updateITInterfaceSuccess,
      (state, { itInterface }): ITInterfaceState => ({ ...state, itInterface })
    ),

    on(
      ITInterfaceActions.removeITInterfaceData,
      (state): ITInterfaceState => ({ ...state, isLoadingInterfaceDataRows: true })
    ),
    on(ITInterfaceActions.removeITInterfaceDataSuccess, (state, { dataUuid }): ITInterfaceState => {
      const data = state.itInterface?.data?.filter((item) => item.uuid !== dataUuid) || [];

      return {
        ...state,
        itInterface: { ...state.itInterface, data } as APIItInterfaceResponseDTO,
        isLoadingInterfaceDataRows: false,
      };
    }),
    on(
      ITInterfaceActions.removeITInterfaceDataError,
      (state): ITInterfaceState => ({ ...state, isLoadingInterfaceDataRows: false })
    ),

    on(ITInterfaceActions.updateITInterfaceDataSuccess, (state, { itInterfaceData }): ITInterfaceState => {
      const data =
        state.itInterface?.data?.map((item) => (item.uuid === itInterfaceData.uuid ? itInterfaceData : item)) ?? [];

      return { ...state, itInterface: { ...state.itInterface, data } as APIItInterfaceResponseDTO };
    }),

    on(ITInterfaceActions.addITInterfaceDataSuccess, (state, { itInterfaceData }): ITInterfaceState => {
      const data = [...(state.itInterface?.data || []), itInterfaceData];

      return { ...state, itInterface: { ...state.itInterface, data } as APIItInterfaceResponseDTO };
    }),

    on(ITInterfaceActions.updateGridColumns, (state, { gridColumns }): ITInterfaceState => {
      console.log(gridColumns);
      return {
        ...state,
        gridColumns,
      };
    })
  ),
});
