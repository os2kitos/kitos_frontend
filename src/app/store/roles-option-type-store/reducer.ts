import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { isRoleOptionType, RoleOptionTypes } from 'src/app/shared/models/options/role-option-types.model';
import { GlobalOptionTypeActions } from '../global-admin/global-option-types/actions';
import { LocalOptionTypeActions } from '../local-admin/local-option-types/actions';
import { RoleOptionTypeActions } from './actions';
import { RoleOptionTypeState } from './state';

export const roleOptionTypeAdapter = createEntityAdapter<APIRoleOptionResponseDTO>({
  selectId: (optionType) => optionType.uuid,
});

const createInitialOptionState = () =>
  roleOptionTypeAdapter.getInitialState({
    cacheTime: undefined,
    isLoading: false,
  });

function createEmptyState(): RoleOptionTypeState {
  return {
    'it-system-usage': null,
    'it-contract': null,
    'data-processing': null,
    'organization-unit': null,
  };
}

export const roleOptionTypeInitialState: RoleOptionTypeState = createEmptyState();

export const roleOptionTypeFeature = createFeature({
  name: 'RoleOptionType',
  reducer: createReducer(
    roleOptionTypeInitialState,
    on(RoleOptionTypeActions.getOptions, (state, { optionType }): RoleOptionTypeState => {
      const nextState = getNextState(state);

      const updatedState = updateIsLoading(nextState, optionType, true);

      return updatedState;
    }),
    on(RoleOptionTypeActions.updateLoadingOnValidCache, (state, { optionType }): RoleOptionTypeState => {
      const nextState = getNextState(state);

      const updatedState = updateIsLoading(nextState, optionType, false);

      return updatedState;
    }),
    on(RoleOptionTypeActions.getOptionsSuccess, (state, { optionType, options }): RoleOptionTypeState => {
      const nextState = getNextState(state);

      const currentOptionState = getCurrentOptionState(nextState, optionType);
      nextState[optionType] = {
        ...roleOptionTypeAdapter.setAll(options, currentOptionState),
        cacheTime: new Date().getTime(),
        isLoading: false,
      };

      return nextState;
    }),
    on(RoleOptionTypeActions.getOptionsError, (state, { optionType }): RoleOptionTypeState => {
      const nextState = getNextState(state);

      const updatedState = updateIsLoading(nextState, optionType, false);

      return updatedState;
    }),
    on(
      LocalOptionTypeActions.updateOptionTypeSuccess,
      GlobalOptionTypeActions.updateOptionTypeSuccess,
      (state, { optionType }) => {
        if (isRoleOptionType(optionType)) {
          const currentOptionState = state[optionType] ?? createInitialOptionState();

          return {
            ...state,
            [optionType]: {
              ...currentOptionState,
              cacheTime: undefined,
            },
          };
        } else {
          return state;
        }
      }
    )
  ),
});

function updateIsLoading(nextState: RoleOptionTypeState, optionType: RoleOptionTypes, isLoading: boolean) {
  const currentOptionState = getCurrentOptionState(nextState, optionType);
  nextState[optionType] = {
    ...currentOptionState,
    isLoading,
  } as any;

  return nextState;
}

function getNextState(state: RoleOptionTypeState | undefined): RoleOptionTypeState {
  return state ? cloneDeep(state) : createEmptyState();
}
function getCurrentOptionState(nextState: RoleOptionTypeState, optionType: RoleOptionTypes) {
  return nextState[optionType] ?? createInitialOptionState();
}
