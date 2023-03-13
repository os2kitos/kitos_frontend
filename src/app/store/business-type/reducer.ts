import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { BusinessTypeActions } from './actions';
import { BusinessTypeState } from './state';

export const businessTypeAdapter = createEntityAdapter<APIRegularOptionResponseDTO>({
  selectId: (businessType) => businessType.uuid,
});

export const businessTypeInitialState: BusinessTypeState = businessTypeAdapter.getInitialState({
  cacheTime: undefined,
});

export const businessTypeFeature = createFeature({
  name: 'BusinessType',
  reducer: createReducer(
    businessTypeInitialState,
    on(
      BusinessTypeActions.getBusinessTypesSuccess,
      (state, { businessTypes }): BusinessTypeState => ({
        ...businessTypeAdapter.setAll(businessTypes, state),
        cacheTime: new Date().getTime(),
      })
    )
  ),
});
