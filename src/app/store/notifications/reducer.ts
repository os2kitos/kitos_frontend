import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { Notification } from 'src/app/shared/models/notifications/notification.model';
import { NotificationsActions } from './actions';
import { NotificationsState } from './state';

export const notificationAdapter = createEntityAdapter<Notification>({
  selectId: (notification) => notification.id,
  sortComparer: (notification) => notification.createdTimeStamp,
});

export const notificationsInitialState: NotificationsState = notificationAdapter.getInitialState();

export const notificationsFeature = createFeature({
  name: 'Notifications',
  reducer: createReducer(
    notificationsInitialState,
    on(
      NotificationsActions.add,
      (state, { notification }): NotificationsState => ({ ...notificationAdapter.addOne(notification, state) })
    ),
    on(
      NotificationsActions.remove,
      (state, { notificationId }): NotificationsState => ({ ...notificationAdapter.removeOne(notificationId, state) })
    )
  ),
});
