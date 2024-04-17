import { PopupMessageType } from '../../enums/popup-message-type';

export interface PopupMessageData {
  message: string;
  type: PopupMessageType;
  durationInMs: number;
}
