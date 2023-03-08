import { createFeature, createReducer, on } from '@ngrx/store';
import { DataClassificationTypeActions } from './actions';
import { dataClassificationTypeAdapter } from './selectors';
import { DataClassificationTypeState, initialState } from './state';

export const dataClassificationTypeFeature = createFeature({
  name: 'DataClassificationType',
  reducer: createReducer(
    initialState,
    on(
      DataClassificationTypeActions.getDataClassificationTypesSuccess,
      (state, { dataClassificationTypes }): DataClassificationTypeState => ({
        ...dataClassificationTypeAdapter.setAll(dataClassificationTypes, state),
        cacheTime: new Date().getTime(),
      })
    )
  ),
});
