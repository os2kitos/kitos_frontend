import { createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { APIRegularOptionExtendedResponseDTO } from 'src/app/api/v2';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { DataClassificationTypeState } from './state';

export const dataClassificationTypeAdapter = createEntityAdapter<APIRegularOptionExtendedResponseDTO>({
  selectId: (dataClassificationType) => dataClassificationType.uuid,
});
const selectState = createFeatureSelector<DataClassificationTypeState>('DataClassificationType');

export const selectDataClassificationTypes = createSelector(
  selectState,
  dataClassificationTypeAdapter.getSelectors().selectAll
);

export const selectHasValidCache = createSelector(
  selectState,
  () => new Date(),
  (state, time) => hasValidCache(state.cacheTime, time)
);
