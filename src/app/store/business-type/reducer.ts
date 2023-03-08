import { createFeature, createReducer, on } from '@ngrx/store';
import { BusinessTypeActions } from './actions';
import { businessTypeAdapter } from './selectors';
import { BusinessTypeState, initialState } from './state';

export const businessTypeFeature = createFeature({
  name: 'BusinessType',
  reducer: createReducer(
    initialState,
    on(
      BusinessTypeActions.getBusinessTypesSuccess,
      (state, { businessTypes }): BusinessTypeState => ({
        ...businessTypeAdapter.setAll(businessTypes, state),
        cacheTime: new Date().getTime(),
      })
    )
  ),
});
