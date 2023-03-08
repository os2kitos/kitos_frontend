import { createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { BusinessTypeState } from './state';

export const businessTypeAdapter = createEntityAdapter<APIRegularOptionResponseDTO>({
  selectId: (businessType) => businessType.uuid,
});
const selectState = createFeatureSelector<BusinessTypeState>('BusinessType');

export const selectBusinessTypes = createSelector(selectState, businessTypeAdapter.getSelectors().selectAll);

export const selectHasValidCache = createSelector(
  selectState,
  () => new Date(),
  (state, time) => hasValidCache(state.cacheTime, time)
);
