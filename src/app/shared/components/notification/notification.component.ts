import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Notification } from '../../models/notifications/notification.model';

@Component({
  selector: 'app-notification[notification]',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  private dismissPeriod = 250;
  public dismissing = false;
  @Input() public notification!: Notification;
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
    }, this.notification.data.durationInMs);
  }
}
