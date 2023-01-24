import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationType } from '../../enums/notification-type';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  @Input() text = '';
  @Input() type = NotificationType.default;

  @Output() public hide = new EventEmitter();

  public shouldHide() {
    this.hide.emit();
  }
}
