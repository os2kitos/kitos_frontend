import { Injectable, OnDestroy } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { NotificationsActions } from 'src/app/store/notifications/actions';
import { UserActions } from 'src/app/store/user-store/actions';
import { NotificationType } from '../enums/notification-type';
import { createNotification } from '../models/notifications/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {
  public subscriptions = new Subscription();

  constructor(private actions$: Actions, private readonly store: Store) {}

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
        .subscribe((params) => this.showDefault(params.customSuccessText ?? $localize`Feltet er opdateret.`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.patchItSystemUsageError))
        .subscribe(() => this.showError($localize`Feltet kunne ikke opdateres.`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.addItSystemUsageRoleSuccess))
        .subscribe(() => this.showDefault($localize`Tildelingen blev tilføjet`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.addItSystemUsageRoleError))
        .subscribe(() => this.showError($localize`Kunne ikke oprette tildelingen`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.removeItSystemUsageRoleSuccess))
        .subscribe(() => this.showDefault($localize`Tildelingen blev fjernet`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.removeItSystemUsageRoleError))
        .subscribe(() => this.showError($localize`Kunne ikke fjerne tildelingen`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.addItSystemUsageRelationSuccess))
        .subscribe(() => this.showDefault($localize`Relation tilføjet`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.addItSystemUsageRelationError))
        .subscribe(() => this.showError($localize`Der opstod en fejl! Kunne ikke tilføje relationen.`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.patchItSystemUsageRelationSuccess))
        .subscribe(() => this.showDefault($localize`Relation ændret`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.patchItSystemUsageRelationError))
        .subscribe(() => this.showError($localize`Der opstod en fejl! Kunne ikke redigere relationen`))
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.removeItSystemUsageRelationSuccess))
        .subscribe(() => this.showDefault($localize`Relationen er slettet`))
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.removeItSystemUsageRelationError))
        .subscribe(() => this.showError($localize`Kunne ikke slette relationen`))
    );
  }

  public show(text: string, type: NotificationType) {
    this.store.dispatch(NotificationsActions.add(createNotification(text, type)));
  }

  public showError(text: string): void {
    this.show(text, NotificationType.error);
  }

  public showDefault(text: string): void {
    this.show(text, NotificationType.default);
  }
}
