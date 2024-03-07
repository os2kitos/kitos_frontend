import { createEntityAdapter } from "@ngrx/entity";
import { createFeature, createReducer, on } from "@ngrx/store";
import { defaultGridState } from "src/app/shared/models/grid-state.model";
import { ITInterface } from "src/app/shared/models/it-interface/it-interface.model";
import { ITInterfaceActions } from "./actions";
import { ITInterfaceState } from "./state";

export const itInterfaceAdapter = createEntityAdapter<ITInterface>();

export const itInterfaceInitialState: ITInterfaceState = itInterfaceAdapter.getInitialState({
  total: 0,
  isLoadingInterfacesQuery: false,
  gridState: defaultGridState,

  loading: undefined,
  itInterface: undefined,

  isRemoving: false,
});

export const itInterfaceFeature = createFeature({
  name: 'ITInterface',
  reducer: createReducer(
    itInterfaceInitialState,
    on(ITInterfaceActions.getITInterfaces,
      (state): ITInterfaceState => ({ ...state, isLoadingInterfacesQuery: true })),
    on(
      ITInterfaceActions.getITInterfacesSuccess,
      (state, { itInterfaces, total }): ITInterfaceState => ({
        ...itInterfaceAdapter.setAll(itInterfaces, state),
        total,
        isLoadingInterfacesQuery: false,
      })
    ),
    on(ITInterfaceActions.getITInterfacesError,
      (state): ITInterfaceState => ({ ...state, isLoadingInterfacesQuery: false })),
  )
})
