import { createSelector } from '@ngrx/store';
import { memoize } from 'lodash';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { RoleOptionTypes } from 'src/app/shared/models/options/role-option-types.model';
import { roleOptionTypeAdapter, roleOptionTypeFeature } from './reducer';

const { selectRoleOptionTypeState } = roleOptionTypeFeature;

export const selectStateByOptionType = memoize((optionType: RoleOptionTypes) =>
  createSelector(selectRoleOptionTypeState, (state) => state[optionType])
);

export const selectRoleOptionTypes = memoize((optionType: RoleOptionTypes) =>
  createSelector(selectStateByOptionType(optionType), (optionState) =>
    optionState ? roleOptionTypeAdapter.getSelectors().selectAll(optionState) : null
  )
);

export const selectRoleOptionTypesDictionary = memoize((optionType: RoleOptionTypes) =>
  createSelector(selectStateByOptionType(optionType), (optionState) =>
    optionState ? roleOptionTypeAdapter.getSelectors().selectEntities(optionState) : null
  )
);

export const selectHasValidCache = memoize((optionType: RoleOptionTypes) =>
  createSelector(
    selectRoleOptionTypeState,
    () => new Date(),
    (state, time) => hasValidCache(state[optionType]?.cacheTime, time)
  )
);
