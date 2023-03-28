import { createSelector } from '@ngrx/store';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { RegularOptionTypes } from 'src/app/shared/models/options/regular-option-types.model';
import { regularOptionTypeAdapter, regularOptionTypeFeature } from './reducer';

const { selectRegularOptionTypeState } = regularOptionTypeFeature;

const selectStateByOptionTypeCache: { [key: string]: unknown } = {};
export const selectStateByOptionType = (optionType: RegularOptionTypes) =>
  memorizedSelector(optionType, selectStateByOptionTypeCache, (optionType) =>
    createSelector(selectRegularOptionTypeState, (state) => state[optionType])
  );

const selectRegularOptionTypesCache: { [key: string]: unknown } = {};
export const selectRegularOptionTypes = (optionType: RegularOptionTypes) =>
  memorizedSelector(optionType, selectRegularOptionTypesCache, (optionType) =>
    createSelector(selectStateByOptionType(optionType), regularOptionTypeAdapter.getSelectors().selectAll)
  );

const selectRegularOptionTypesDictionaryCache: { [key: string]: unknown } = {};
export const selectRegularOptionTypesDictionary = (optionType: RegularOptionTypes) =>
  memorizedSelector(optionType, selectRegularOptionTypesDictionaryCache, (optionType) =>
    createSelector(selectStateByOptionType(optionType), regularOptionTypeAdapter.getSelectors().selectEntities)
  );

const selectHasValidCacheCache: { [key: string]: unknown } = {};
export const selectHasValidCache = (optionType: RegularOptionTypes) =>
  memorizedSelector(optionType, selectHasValidCacheCache, (optionType) =>
    createSelector(
      selectRegularOptionTypeState,
      () => new Date(),
      (state, time) => hasValidCache(state[optionType].cacheTime, time)
    )
  );

function memorizedSelector<TSelector>(
  optionType: RegularOptionTypes,
  cache: { [key: string]: unknown },
  factory: (optionType: RegularOptionTypes) => TSelector
): TSelector {
  let memorizedSelector = cache[optionType];
  if (!memorizedSelector) {
    memorizedSelector = factory(optionType);
    cache[optionType] = memorizedSelector;
  }
  return memorizedSelector as TSelector;
}
