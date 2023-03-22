import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { RegularOptionTypeActions } from './actions';
import { RegularOptionTypeState } from './state';

export const regularOptionTypeAdapter = createEntityAdapter<APIRegularOptionResponseDTO>({
  selectId: (contractType) => contractType.uuid,
});

const createInitialOptionState = () =>
  regularOptionTypeAdapter.getInitialState({
    cacheTime: undefined,
  });

export const regularOptionTypeInitialState: RegularOptionTypeState = {
  'it-contract_contract-type': createInitialOptionState(),
  'it-interface_interface-type': createInitialOptionState(),
  'it-system_business-type': createInitialOptionState(),
  'it-system_usage-data-classification-type': createInitialOptionState(),
};

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
