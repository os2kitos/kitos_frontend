import { createSelector } from '@ngrx/store';
import { notificationsFeature } from './reducer';

const { selectNotificationsState } = notificationsFeature;
export const selectAllNotifications = createSelector(selectNotificationsState, (state) => state.notifications);
