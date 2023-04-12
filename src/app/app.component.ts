import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
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
    private dialog: MatDialog,
    private organizationService: OrganizationService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit() {
    this.registerCustomMaterialIcons();
    this.ensureUserIsPartOfAnOrganization();
    this.notificationService.subscribeOnActions();
  }

  private registerCustomMaterialIcons() {
    this.iconRegistry.addSvgIcon(
      'custom-mat-calendar-toggle-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/img/calendar.svg')
    );
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
          this.dialog.open(ChooseOrganizationComponent, {
            disableClose: true,
          });
        }

        this.store.dispatch(UserActions.updateHasMultipleOrganizations(organizations.length > 1));
      })
    );
  }
}
