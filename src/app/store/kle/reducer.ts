import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { APIKLEDetailsDTO } from 'src/app/api/v2';
import { KLEActions } from './actions';
import { KLEState } from './state';

export const kleAdapter = createEntityAdapter<APIKLEDetailsDTO>({
  selectId: (kle) => kle.uuid,
});

export const kleInitialState: KLEState = kleAdapter.getInitialState({
  cacheTime: undefined,
});

export const kleFeature = createFeature({
  name: 'KLE',
  reducer: createReducer(
    kleInitialState,
    on(
      KLEActions.getKLEsSuccess,
      (state, { kles }): KLEState => ({
        ...kleAdapter.setAll(kles, state),
        cacheTime: new Date().getTime(),
      })
    )
  ),
});
