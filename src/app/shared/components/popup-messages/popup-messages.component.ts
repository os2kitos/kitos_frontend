import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { PopupMessageActions } from 'src/app/store/popup-messages/actions';
import { selectAllPopupMessages } from 'src/app/store/popup-messages/selectors';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-popup-messages',
  templateUrl: './popup-messages.component.html',
  styleUrls: ['./popup-messages.component.scss'],
})
export class PopupMessagesComponent extends BaseComponent {
  public readonly activePopupMessages$ = this.store.select(selectAllPopupMessages);

  constructor(private readonly store: Store) {
    super();
  }

  public dismiss(popupMessageId: string) {
    this.store.dispatch(PopupMessageActions.remove(popupMessageId));
  }
}
