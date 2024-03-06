import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { defaultGridState } from 'src/app/shared/models/grid-state.model';
import { ITContact } from 'src/app/shared/models/it-contract/it-contract.model';
import { ITContractActions } from './actions';
import { ITContactState } from './state';

export const itContactAdapter = createEntityAdapter<ITContact>();

export const itContactInitialState: ITContactState = itContactAdapter.getInitialState({
  total: 0,
  isLoadingContractsQuery: false,
  gridState: defaultGridState,

  loading: undefined,
  itContract: undefined,

  isRemoving: false,
});

export const itContractFeature = createFeature({
  name: 'ITContract',
  reducer: createReducer(
    itContactInitialState,
    on(
      ITContractActions.getITContract,
      (state): ITContactState => ({ ...state, itContract: undefined, loading: true })
    ),
    on(
      ITContractActions.getITContractSuccess,
      (state, { itContract }): ITContactState => ({ ...state, itContract, loading: false })
    ),
    on(ITContractActions.getITContracts, (state): ITContactState => ({ ...state, isLoadingContractsQuery: true })),
    on(
      ITContractActions.getITContractsSuccess,
      (state, { itContracts, total }): ITContactState => ({
        ...itContactAdapter.setAll(itContracts, state),
        total,
        isLoadingContractsQuery: false,
      })
    ),
    on(
      ITContractActions.getITContractsError,
      (state): ITContactState => ({ ...state, isLoadingContractsQuery: false })
    ),
    on(ITContractActions.deleteITContract, (state): ITContactState => ({ ...state, isRemoving: true })),
    on(ITContractActions.deleteITContractSuccess, (state): ITContactState => ({ ...state, isRemoving: false })),
    on(ITContractActions.deleteITContractError, (state): ITContactState => ({ ...state, isRemoving: false })),
    on(ITContractActions.patchITContractSuccess, (state, { itContract }): ITContactState => ({ ...state, itContract }))
  ),
});
