import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { ContractTypeActions } from './actions';
import { ContractTypeState } from './state';

export const contractTypeAdapter = createEntityAdapter<APIRegularOptionResponseDTO>({
  selectId: (contractType) => contractType.uuid,
});

export const contractTypeInitialState: ContractTypeState = contractTypeAdapter.getInitialState({
  cacheTime: undefined,
});

export const contractTypeFeature = createFeature({
  name: 'ContractType',
  reducer: createReducer(
    contractTypeInitialState,
    on(
      ContractTypeActions.getContractTypesSuccess,
      (state, { contractTypes }): ContractTypeState => ({
        ...contractTypeAdapter.setAll(contractTypes, state),
        cacheTime: new Date().getTime(),
      })
    )
  ),
});
