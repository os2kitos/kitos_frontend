import { createFeature, createReducer, on } from '@ngrx/store';
import { KLEActions } from './actions';
import { kleAdapter } from './selectors';
import { kleInitialState, KLEState } from './state';

export const kleFeature = createFeature({
  name: 'KLE',
  reducer: createReducer(
    kleInitialState,
    on(
      KLEActions.getKlesSuccess,
      (state, { kles }): KLEState => ({
        ...kleAdapter.setAll(kles, state),
        cacheTime: new Date().getTime(),
      })
    )
  ),
});
