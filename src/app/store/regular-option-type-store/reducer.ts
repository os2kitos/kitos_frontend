import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { RegularOptionTypes } from 'src/app/shared/models/options/regular-option-types.model';
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
    on(
      RegularOptionTypeActions.getOptionsSuccess,
      (state, { optionType: optionType, options: options }): RegularOptionTypeState => {
        const nextState = createEmptyState();

        //Copy entries from current state to the next state
        Object.keys(nextState).forEach(
          (key) => (nextState[key as RegularOptionTypes] = { ...state[key as RegularOptionTypes] })
        );

        //Update the changed state
        const currentOptionState = nextState[optionType];
        nextState[optionType] = {
          ...regularOptionTypeAdapter.setAll(options, currentOptionState),
          cacheTime: new Date().getTime(),
        };

        return nextState;
      }
    )
  ),
});
