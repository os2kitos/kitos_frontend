import { createEntityAdapter } from "@ngrx/entity";
import { createFeature, createReducer, on } from "@ngrx/store";
import { APIRegularOptionResponseDTO } from "src/app/api/v2";
import { InterfaceTypeActions } from "./actions";
import { InterfaceTypeState } from "./state";

export const interfaceTypeAdapter = createEntityAdapter<APIRegularOptionResponseDTO>({
  selectId: (interfaceType) => interfaceType.uuid,
});

export const interfaceTypeInitialState: InterfaceTypeState = interfaceTypeAdapter.getInitialState({
  cacheTime: undefined,
});

export const interfaceTypeFeature = createFeature({
  name: 'InterfaceType',
  reducer: createReducer(
    interfaceTypeInitialState,
    on(
      InterfaceTypeActions.getInterfaceTypesSuccess,
      (state, { interfaceType }): InterfaceTypeState => ({
        ...interfaceTypeAdapter.setAll(interfaceType, state),
        cacheTime: new Date().getTime(),
      })
    )
  ),
});
