import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { RoleOptionTypeActions } from './actions';
import { RoleOptionTypeState } from './state';
import { LocalOptionTypeActions } from '../local-admin/local-option-types/actions';
import { isRoleOptionType } from 'src/app/shared/models/options/role-option-types.model';
import { GlobalOptionTypeActions } from '../global-admin/global-option-types/actions';

export const roleOptionTypeAdapter = createEntityAdapter<APIRoleOptionResponseDTO>({
  selectId: (optionType) => optionType.uuid,
});

const createInitialOptionState = () =>
  roleOptionTypeAdapter.getInitialState({
    cacheTime: undefined,
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
    on(RoleOptionTypeActions.getOptionsSuccess, (state, { optionType, options }): RoleOptionTypeState => {
      const nextState = state ? cloneDeep(state) : createEmptyState();

      //Update the changed state
      const currentOptionState = nextState[optionType] ?? createInitialOptionState();
      nextState[optionType] = {
        ...roleOptionTypeAdapter.setAll(options, currentOptionState),
        cacheTime: new Date().getTime(),
      };

      return nextState;
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
