import { createEntityAdapter } from '@ngrx/entity';
import { Alert, AlertsState, RelatedEntityType } from './state';
import { createFeature, createReducer, on } from '@ngrx/store';
import { AlertActions } from './actions';

export const alertsAdapter = createEntityAdapter<Alert>({
  selectId: (alert) => alert.uuid,
});

export const initialAlertsState: AlertsState = {
  alerts: {
    [RelatedEntityType.ItSystemUsage]: alertsAdapter.getInitialState(),
    [RelatedEntityType.ItContract]: alertsAdapter.getInitialState(),
    [RelatedEntityType.DataProcessingRegistration]: alertsAdapter.getInitialState(),
  },
  cacheTimes: {
    [RelatedEntityType.ItSystemUsage]: undefined,
    [RelatedEntityType.ItContract]: undefined,
    [RelatedEntityType.DataProcessingRegistration]: undefined,
  },
};

export const alertsFeature = createFeature({
  name: 'alerts',
  reducer: createReducer(
    initialAlertsState,
    on(AlertActions.getAlertsSuccess, (state, { alerts, entityType }) => {
      return {
        ...state,
        alerts: {
          ...state.alerts,
          [entityType]: alertsAdapter.setAll(alerts, state.alerts[entityType]),
        },
        cacheTimes: {
          ...state.cacheTimes,
          [entityType]: Date.now(),
        },
      };
    }),

    on(AlertActions.deleteAlertSuccess, (state, { entityType, alertUuid }) => {
      return {
        ...state,
        alerts: {
          ...state.alerts,
          [entityType]: alertsAdapter.removeOne(alertUuid, state.alerts[entityType]),
        },
      };
    })
  ),
});
