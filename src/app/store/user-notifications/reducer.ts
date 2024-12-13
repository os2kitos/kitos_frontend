import { createEntityAdapter } from '@ngrx/entity';
import { NotificationState, UserNotification } from './state';
import { createFeature, createReducer, on } from '@ngrx/store';
import { UserNotificationActions } from './actions';

export const systemNotificationsAdapter = createEntityAdapter<UserNotification>({
  selectId: (notification) => notification.uuid,
});
export const contractNotificationsAdapter = createEntityAdapter<UserNotification>({
  selectId: (notification) => notification.uuid,
});
export const dprNotificationsAdapter = createEntityAdapter<UserNotification>({
  selectId: (notification) => notification.uuid,
});

export const initialNotificationsState: NotificationState = {
  usageNotifications: systemNotificationsAdapter.getInitialState(),
  contractNotifications: contractNotificationsAdapter.getInitialState(),
  dataProcessingNotifications: dprNotificationsAdapter.getInitialState(),
  cacheTime: {},
};

export const notificationFeature = createFeature({
  name: 'userNotifications',
  reducer: createReducer(
    initialNotificationsState,
    on(UserNotificationActions.getNotificationsSuccess, (state, { ownerResourceType, notifications }) => {
      let newState = { ...state };
      switch (ownerResourceType) {
        case 'ItSystemUsage':
          newState = {
            ...newState,
            usageNotifications: systemNotificationsAdapter.setAll(notifications, newState.usageNotifications),
          };
          break;
        case 'ItContract':
          newState = {
            ...newState,
            contractNotifications: contractNotificationsAdapter.setAll(notifications, newState.contractNotifications),
          };
          break;
        case 'DataProcessingRegistration':
          newState = {
            ...newState,
            dataProcessingNotifications: dprNotificationsAdapter.setAll(
              notifications,
              newState.dataProcessingNotifications
            ),
          };
          break;
        default:
          return newState;
      }

      return {
        ...newState,
        cacheTime: {
          ...newState.cacheTime,
          [ownerResourceType]: Date.now(),
        },
      };
    }),
    on(UserNotificationActions.notificationCreated, (state, { ownerResourceType }): NotificationState => {
      return {
        ...state,
        cacheTime: {
          ...state.cacheTime,
          [ownerResourceType]: undefined,
        },
      };
    })
  ),
});
