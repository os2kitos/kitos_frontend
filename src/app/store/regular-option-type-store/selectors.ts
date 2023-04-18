import { createSelector } from '@ngrx/store';
import { memoize } from 'lodash';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { RegularOptionTypes } from 'src/app/shared/models/options/regular-option-types.model';
import { regularOptionTypeAdapter, regularOptionTypeFeature } from './reducer';

const { selectRegularOptionTypeState } = regularOptionTypeFeature;

export const selectStateByOptionType = memoize((optionType: RegularOptionTypes) =>
  createSelector(selectRegularOptionTypeState, (state) => state[optionType])
);

export const selectRegularOptionTypes = memoize((optionType: RegularOptionTypes) =>
  createSelector(selectStateByOptionType(optionType), (optionState) =>
    optionState ? regularOptionTypeAdapter.getSelectors().selectAll(optionState) : null
  )
);

export const selectRegularOptionTypesDictionary = memoize((optionType: RegularOptionTypes) =>
  createSelector(selectStateByOptionType(optionType), (optionState) =>
    optionState ? regularOptionTypeAdapter.getSelectors().selectEntities(optionState) : null
  )
);

export const selectHasValidCache = memoize((optionType: RegularOptionTypes) =>
  createSelector(
    selectRegularOptionTypeState,
    () => new Date(),
    (state, time) => hasValidCache(state[optionType]?.cacheTime, time)
  )
);
