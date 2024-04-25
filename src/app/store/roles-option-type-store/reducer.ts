import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { RoleOptionTypeActions } from './actions';
import { RoleOptionTypeState } from './state';

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
    })
  ),
});
