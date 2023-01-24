import { Injectable } from '@angular/core';
import { NotificationService as KendoNotificationService } from '@progress/kendo-angular-notification';
import { NotificationComponent } from '../components/notification/notification.component';
import { NotificationType } from '../enums/notification-type';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private notificationService: KendoNotificationService) {}

  public show(text: string, type: NotificationType) {
    const notificationRef = this.notificationService.show({
      content: NotificationComponent,
      hideAfter: 3500,
      position: { horizontal: 'right', vertical: 'bottom' },
      animation: { type: 'fade', duration: 500 },
    });

    const notificationComponent = notificationRef.content?.instance as NotificationComponent;

    if (notificationComponent) {
      notificationComponent.text = text;
      notificationComponent.type = type;
      notificationComponent.hide.subscribe(() => notificationRef.hide());
    }
  }

  public showError(text: string): void {
    this.show(text, NotificationType.error);
  }

  public showDefault(text: string): void {
    this.show(text, NotificationType.default);
  }
}
