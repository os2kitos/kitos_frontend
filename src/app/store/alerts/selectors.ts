import { createSelector } from '@ngrx/store';
import { AlertsState, RelatedEntityType } from './state';
import { alertsAdapter, alertsFeature } from './reducers';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';

export const { selectAlertsState } = alertsFeature;

const { selectAll } = alertsAdapter.getSelectors();

export const selectAlertsByType = (entityType: RelatedEntityType) =>
  createSelector(selectAlertsState, (state: AlertsState) => {
    const entityState = state.alerts[entityType];
    return selectAll(entityState);
  });

export const selectAlertCacheTime = (entityType: RelatedEntityType) =>
  createSelector(
    selectAlertsState,
    () => new Date(),
    (state, time) => {
      const cacheTime = state.cacheTimes[entityType];
      return hasValidCache(cacheTime, time);
    }
  );

export const selectAllAlertCount = createSelector(selectAlertsState, (state: AlertsState) => {
  return Object.values(RelatedEntityType).reduce((total, type) => {
    const entityState = state.alerts[type];
    const count = entityState.ids.length;
    return total + count;
  }, 0);
});
