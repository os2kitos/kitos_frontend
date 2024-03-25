import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { defaultGridState } from 'src/app/shared/models/grid-state.model';
import { ITInterface } from 'src/app/shared/models/it-interface/it-interface.model';
import { ITInterfaceActions } from './actions';
import { ITInterfaceState } from './state';

export const itInterfaceAdapter = createEntityAdapter<ITInterface>();

export const itInterfaceInitialState: ITInterfaceState = itInterfaceAdapter.getInitialState({
  total: 0,
  isLoadingInterfacesQuery: false,
  gridState: defaultGridState,

  loading: undefined,
  itInterface: undefined,

  isRemoving: false,

  permissions: undefined,

  isLoadingInterfaceDataRows: false,
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
      ITInterfaceActions.updateITInterfaceSuccess,
      (state, { itInterface }): ITInterfaceState => ({ ...state, itInterface })
    ),

    on(
      ITInterfaceActions.removeITInterfaceData,
      (state): ITInterfaceState => ({ ...state, isLoadingInterfaceDataRows: true })
    ),
    on(
      ITInterfaceActions.removeITInterfaceDataSuccess,
      (state): ITInterfaceState => ({ ...state, isLoadingInterfaceDataRows: false })
    ),
    on(
      ITInterfaceActions.removeITInterfaceDataError,
      (state): ITInterfaceState => ({ ...state, isLoadingInterfaceDataRows: false })
    )
  ),
});
