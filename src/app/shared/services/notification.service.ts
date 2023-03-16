import { Injectable, OnDestroy } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { NotificationService as KendoNotificationService } from '@progress/kendo-angular-notification';
import { Subscription } from 'rxjs';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { UserActions } from 'src/app/store/user-store/actions';
import { NotificationComponent } from '../components/notification/notification.component';
import { NotificationType } from '../enums/notification-type';

@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {
  public subscriptions = new Subscription();

  constructor(private actions$: Actions, private notificationService: KendoNotificationService) {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public subscribeOnActions() {
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(UserActions.loginSuccess))
        .subscribe(() => this.showDefault($localize`Du er nu logget ind`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(UserActions.loginError))
        .subscribe(() => this.showError($localize`Kunne ikke logge ind`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(UserActions.logoutSuccess))
        .subscribe(() => this.showDefault($localize`Du er nu logget ud`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(UserActions.logoutError))
        .subscribe(() => this.showError($localize`Kunne ikke logge ud`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.patchItSystemUsageSuccess))
        .subscribe(() => this.showDefault($localize`Feltet er opdateret.`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.patchItSystemUsageError))
        .subscribe(() => this.showError($localize`Feltet kunne ikke opdateres.`))
    );
  }

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
