import { createSelector } from '@ngrx/store';
import { popupMessageAdapter, popupMessagesFeature } from './reducer';

const { selectPopupMessagesState: selectPopupMessagesState } = popupMessagesFeature;
export const selectAllPopupMessages = createSelector(
  selectPopupMessagesState,
  popupMessageAdapter.getSelectors().selectAll
);
