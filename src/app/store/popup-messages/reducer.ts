import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { PopupMessage } from 'src/app/shared/models/popup-messages/popup-message.model';
import { PopupMessageActions } from './actions';
import { PopupMessagesState } from './state';

export const popupMessageAdapter = createEntityAdapter<PopupMessage>({
  selectId: (notification) => notification.id,
  sortComparer: (notification) => notification.createdTimeStamp,
});

export const popupMessagesInitialState: PopupMessagesState = popupMessageAdapter.getInitialState();

export const popupMessagesFeature = createFeature({
  name: 'PopupMessages',
  reducer: createReducer(
    popupMessagesInitialState,
    on(
      PopupMessageActions.add,
      (state, { popupMessage: notification }): PopupMessagesState => ({ ...popupMessageAdapter.addOne(notification, state) })
    ),
    on(
      PopupMessageActions.remove,
      (state, { popupMessageId: notificationId }): PopupMessagesState => ({ ...popupMessageAdapter.removeOne(notificationId, state) })
    )
  ),
});
