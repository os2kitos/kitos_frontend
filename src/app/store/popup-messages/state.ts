import { EntityState } from '@ngrx/entity';
import { PopupMessage } from 'src/app/shared/models/popup-messages/popup-message.model';

export type PopupMessagesState = EntityState<PopupMessage>;
