import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { RegularOptionTypeActions } from './actions';
import { RegularOptionTypeState } from './state';

export const regularOptionTypeAdapter = createEntityAdapter<APIRegularOptionResponseDTO>({
  selectId: (contractType) => contractType.uuid,
});

export const regularOptionTypeInitialState: RegularOptionTypeState = regularOptionTypeAdapter.getInitialState({
  cacheTime: undefined,
});

export const regularOptionTypeFeature = createFeature({
  name: 'RegularOptionType',
  reducer: createReducer(
    regularOptionTypeInitialState,
    on(
      RegularOptionTypeActions.getOptionsSuccess,
      (state, { contractTypes: regularOptionTypes }): RegularOptionTypeState => ({
        ...regularOptionTypeAdapter.setAll(regularOptionTypes, state), //TODO: Use option type to get the right slot
        cacheTime: new Date().getTime(),
      })
    )
  ),
});
