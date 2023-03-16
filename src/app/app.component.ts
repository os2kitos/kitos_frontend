import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogCloseResult, DialogService } from '@progress/kendo-angular-dialog';
import { filter, withLatestFrom } from 'rxjs';
import { ChooseOrganizationComponent } from './modules/layout/choose-organization/choose-organization.component';
import { BaseComponent } from './shared/base/base.component';
import { NotificationService } from './shared/services/notification.service';
import { selectOrganizations, selectOrganizationsIsLoaded } from './store/organization/selectors';
import { UserActions } from './store/user-store/actions';
import { selectIsAuthenticating, selectUserOrganizationExists } from './store/user-store/selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends BaseComponent implements OnInit {
  public isAuthenticating$ = this.store.select(selectIsAuthenticating);

  constructor(
    private store: Store,
    private notificationService: NotificationService,
    private dialogService: DialogService
  ) {
    super();
  }

  ngOnInit() {
    // Ensure user is part of an organization
    this.subscriptions.add(
      this.store
        .select(selectOrganizationsIsLoaded)
        .pipe(
          filter((organizationsIsLoaded) => organizationsIsLoaded),
          withLatestFrom(this.store.select(selectUserOrganizationExists), this.store.select(selectOrganizations)),
          filter(([_, userOrganizationExists]) => !userOrganizationExists)
        )
        .subscribe(([_, userOrganizationExists, organizations]) => {
          // Logout if user is not part of any organizations
          if (organizations.length === 0) {
            this.store.dispatch(UserActions.logout());
          }
          // Automatically choose organization if user is only part of one
          else if (organizations.length === 1) {
            this.store.dispatch(UserActions.updateOrganization(organizations.pop()));
          }
          // Force the user to choose on organization if user has not selected an organization or organization
          // selected does not exist anymore.
          else if (!userOrganizationExists) {
            const dialogRef = this.dialogService.open({
              content: ChooseOrganizationComponent,
              preventAction: (ev) => ev instanceof DialogCloseResult,
            });
            (dialogRef.content.instance as ChooseOrganizationComponent).closable = false;
          }
        })
    );

    this.notificationService.subscribeOnActions();
  }
}
