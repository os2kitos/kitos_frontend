import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationsActions } from 'src/app/store/notifications/actions';
import { selectAllNotifications } from 'src/app/store/notifications/selectors';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent extends BaseComponent {
  public readonly activeNotifications$ = this.store.select(selectAllNotifications);

  constructor(private readonly store: Store) {
    super();
  }

  public dismiss(notificationId: string) {
    this.store.dispatch(NotificationsActions.remove(notificationId));
  }
}
