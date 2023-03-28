import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';
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

function createEmptyState(): RegularOptionTypeState {
  return {
    'it-contract_contract-type': createInitialOptionState(),
    'it-interface_interface-type': createInitialOptionState(),
    'it-system_business-type': createInitialOptionState(),
    'it-system_usage-data-classification-type': createInitialOptionState(),
  };
}

export const regularOptionTypeInitialState: RegularOptionTypeState = createEmptyState();

export const regularOptionTypeFeature = createFeature({
  name: 'RegularOptionType',
  reducer: createReducer(
    regularOptionTypeInitialState,
    on(RegularOptionTypeActions.getOptionsSuccess, (state, { optionType, options }): RegularOptionTypeState => {
      const nextState = cloneDeep(state);

      //Update the changed state
      const currentOptionState = nextState[optionType];
      nextState[optionType] = {
        ...regularOptionTypeAdapter.setAll(options, currentOptionState),
        cacheTime: new Date().getTime(),
      };

      return nextState;
    })
  ),
});
