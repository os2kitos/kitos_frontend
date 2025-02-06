import { createSelector } from '@ngrx/store';
import { AlertsState, RelatedEntityType } from './state';
import { alertsAdapter, alertsFeature } from './reducers';
import { hasValidCache } from 'src/app/shared/helpers/date.helpers';
import { selectUIRootConfig } from '../organization/selectors';

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

export const selectAllAlertCount = createSelector(selectUIRootConfig, selectAlertsState, (config, alertState) => {
  let count = 0;
  if (config?.showDataProcessing) {
    count = alertState.alerts[RelatedEntityType.DataProcessingRegistration].ids.length;
  }
  if (config?.showItContractModule) {
    count += alertState.alerts[RelatedEntityType.ItContract].ids.length;
  }
  if (config?.showItSystemModule) {
    count += alertState.alerts[RelatedEntityType.ItSystemUsage].ids.length;
  }
  return count;
});
