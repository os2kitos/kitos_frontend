import { createSelector } from '@ngrx/store';
import { notificationAdapter, notificationsFeature } from './reducer';

const { selectNotificationsState } = notificationsFeature;
export const selectAllNotifications = createSelector(
  selectNotificationsState,
  notificationAdapter.getSelectors().selectAll
);
