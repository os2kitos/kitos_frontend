import { createFeature, createReducer, on } from '@ngrx/store';
import { NotificationsActions } from './actions';
import { NotificationsState } from './state';

export const notificationsInitialState: NotificationsState = { notifications: [] };

export const notificationsFeature = createFeature({
  name: 'Notifications',
  reducer: createReducer(
    notificationsInitialState,
    on(
      NotificationsActions.add,
      (state, { notification }): NotificationsState => ({
        notifications: [...state.notifications, notification],
      })
    ),
    on(
      NotificationsActions.remove,
      (state, { notificationId }): NotificationsState => ({
        notifications: state.notifications.filter((notification) => notification.id !== notificationId),
      })
    )
  ),
});
