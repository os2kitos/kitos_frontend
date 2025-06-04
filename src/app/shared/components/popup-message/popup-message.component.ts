import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PopupMessage } from '../../models/popup-messages/popup-message.model';
import { NgClass } from '@angular/common';
import { ButtonComponent } from '../buttons/button/button.component';
import { WhiteXIconComponent } from '../icons/white-x-icon.component';

@Component({
  selector: 'app-popup-message[popupMessage]',
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.scss'],
  imports: [NgClass, ButtonComponent, WhiteXIconComponent],
})
export class PopupMessageComponent implements OnInit {
  private dismissPeriod = 250;
  public dismissing = false;
  @Input() public popupMessage!: PopupMessage;
  @Output() public dismissed = new EventEmitter();

  public dismiss() {
    if (!this.dismissing) {
      this.dismissing = true;
      setTimeout(() => {
        this.dismissed.emit();
      }, this.dismissPeriod);
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.dismiss();
    }, this.popupMessage.data.durationInMs);
  }
}
