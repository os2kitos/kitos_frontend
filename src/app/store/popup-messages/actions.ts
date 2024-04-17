import { createActionGroup } from '@ngrx/store';
import { PopupMessage } from 'src/app/shared/models/popup-messages/popup-message.model';

export const PopupMessageActions = createActionGroup({
  source: 'PopupMessages',
  events: {
    'Add ': (popupMessage: PopupMessage) => ({ popupMessage: popupMessage }),
    'Remove ': (popupMessageId: string) => ({ popupMessageId: popupMessageId }),
  },
});
