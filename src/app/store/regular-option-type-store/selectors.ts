import { createSelector } from '@ngrx/store';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { RegularOptionTypes } from 'src/app/shared/models/options/regular-option-types.model';
import { regularOptionTypeAdapter, regularOptionTypeFeature } from './reducer';

const { selectRegularOptionTypeState } = regularOptionTypeFeature;

export const selectStateByOptionType = (optionType: RegularOptionTypes) =>
  createSelector(selectRegularOptionTypeState, (state) => state[optionType]);

export const selectRegularOptionTypes = (optionType: RegularOptionTypes) =>
  createSelector(selectStateByOptionType(optionType), regularOptionTypeAdapter.getSelectors().selectAll);

export const selectRegularOptionTypesDictionary = (optionType: RegularOptionTypes) =>
  createSelector(selectStateByOptionType(optionType), regularOptionTypeAdapter.getSelectors().selectEntities);

export const selectHasValidCache = (optionType: RegularOptionTypes) =>
  createSelector(
    selectRegularOptionTypeState,
    () => new Date(),
    (state, time) => hasValidCache(state[optionType].cacheTime, time)
  );
