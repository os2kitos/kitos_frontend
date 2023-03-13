import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { APIRegularOptionExtendedResponseDTO } from 'src/app/api/v2';
import { DataClassificationTypeActions } from './actions';
import { DataClassificationTypeState } from './state';

export const dataClassificationTypeAdapter = createEntityAdapter<APIRegularOptionExtendedResponseDTO>({
  selectId: (dataClassificationType) => dataClassificationType.uuid,
});

export const dataClassificationTypeInitialState: DataClassificationTypeState =
  dataClassificationTypeAdapter.getInitialState({
    cacheTime: undefined,
  });

export const dataClassificationTypeFeature = createFeature({
  name: 'DataClassificationType',
  reducer: createReducer(
    dataClassificationTypeInitialState,
    on(
      DataClassificationTypeActions.getDataClassificationTypesSuccess,
      (state, { dataClassificationTypes }): DataClassificationTypeState => ({
        ...dataClassificationTypeAdapter.setAll(dataClassificationTypes, state),
        cacheTime: new Date().getTime(),
      })
    )
  ),
});
