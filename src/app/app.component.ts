import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogCloseResult, DialogService } from '@progress/kendo-angular-dialog';
import { ChooseOrganizationComponent } from './modules/layout/choose-organization/choose-organization.component';
import { BaseComponent } from './shared/base/base.component';
import { NotificationService } from './shared/services/notification.service';
import { OrganizationService } from './shared/services/organization.service';
import { UserActions } from './store/user-store/actions';
import { selectIsAuthenticating } from './store/user-store/selectors';

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
    private dialogService: DialogService,
    private organizationService: OrganizationService
  ) {
    super();
  }

  ngOnInit() {
    this.ensureUserIsPartOfAnOrganization();

    this.notificationService.subscribeOnActions();
  }

  private ensureUserIsPartOfAnOrganization() {
    this.subscriptions.add(
      this.organizationService.verifiedUserOrganization$.subscribe(({ organization, organizations }) => {
        // Logout if user is not part of any organizations
        if (organizations.length === 0) {
          return this.store.dispatch(UserActions.logout());
        }
        // Automatically choose organization if user is only part of one or persisted organization exists
        else if (organization || organizations.length === 1) {
          this.store.dispatch(UserActions.updateOrganization(organization ?? organizations[0]));
        }
        // Force the user to choose on organization if user has not selected an organization or organization
        // selected does not exist anymore.
        else {
          const dialogRef = this.dialogService.open({
            content: ChooseOrganizationComponent,
            preventAction: (ev) => ev instanceof DialogCloseResult,
          });
          (dialogRef.content.instance as ChooseOrganizationComponent).closable = false;
        }

        this.store.dispatch(UserActions.updateHasMultipleOrganizations(organizations.length > 1));
      })
    );
  }
}
