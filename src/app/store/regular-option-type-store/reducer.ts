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
    'it-contract_contract-type': null,
    'it-interface_interface-type': null,
    'it-system_business-type': null,
    'it-system_usage-data-classification-type': null,
    'it-system_usage-relation-frequency-type': null,
    'it_system_usage-gdpr-sensitive-data-type': null,
    'it_system_usage-gdpr-registered-data-category-type': null,
    'it-system_usage-archive-type': null,
    'it-system_usage-archive-location-type': null,
    'it-system_usage-archive-location-test-type': null,
    'it-system-usage-roles': null,
    'it-interface_data-type': null,
    'it-contract_contract-template-type': null,
    'it-contract_criticality-type': null,
    'it-contract_procurement-strategy-type': null,
    'it-contract_purchase-form-type': null,
    'it-contract-agreement-element-types': null,
    'it-contract-extend-types': null,
    'it-contract-termination-period-types': null,
    'it-contract-payment-frequency-types': null,
    'it-contract-payment-model-types': null,
    'it-contract-price-regulation-types': null,
  };
}

export const regularOptionTypeInitialState: RegularOptionTypeState = createEmptyState();

export const regularOptionTypeFeature = createFeature({
  name: 'RegularOptionType',
  reducer: createReducer(
    regularOptionTypeInitialState,
    on(RegularOptionTypeActions.getOptionsSuccess, (state, { optionType, options }): RegularOptionTypeState => {
      const nextState = state ? cloneDeep(state) : createEmptyState();

      //Update the changed state
      const currentOptionState = nextState[optionType] ?? createInitialOptionState();
      nextState[optionType] = {
        ...regularOptionTypeAdapter.setAll(options, currentOptionState),
        cacheTime: new Date().getTime(),
      };

      return nextState;
    })
  ),
});
