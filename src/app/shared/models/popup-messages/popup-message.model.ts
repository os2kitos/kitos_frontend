import { uniqueId } from 'lodash';
import { DEFAULT_NOTIFICATION_DURATION } from '../../constants/constants';
import { PopupMessageType } from '../../enums/popup-message-type';
import { PopupMessageData } from './popup-message-data.model';

export interface PopupMessage {
  id: string;
  createdTimeStamp: number;
  data: PopupMessageData;
}

export function createPopupMessage(
  message: string,
  type: PopupMessageType = PopupMessageType.default,
  durationInMs: number = DEFAULT_NOTIFICATION_DURATION
): PopupMessage {
  return {
    createdTimeStamp: Date.now(),
    id: uniqueId(type),
    data: {
      message,
      type,
      durationInMs,
    },
  };
}
