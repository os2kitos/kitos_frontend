import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ChooseOrganizationComponent } from './modules/layout/choose-organization/choose-organization.component';
import { BaseComponent } from './shared/base/base.component';
import { ExternalReferencesStoreAdapterService } from './shared/services/external-references-store-adapter.service';
import { MaterialIconsConfigService } from './shared/services/material-icons-config.service';
import { NotificationService } from './shared/services/notification.service';
import { OrganizationService } from './shared/services/organization.service';
import { RoleOptionTypeService } from './shared/services/role-option-type.service';
import { UserActions } from './store/user-store/actions';
import { selectIsAuthenticating } from './store/user-store/selectors';
import { Actions, ofType } from '@ngrx/effects';
import { RelatedEntityType } from './store/alerts/state';
import { AlertActions } from './store/alerts/actions';

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
    private roleOptionTypeService: RoleOptionTypeService,
    private dialog: MatDialog,
    private organizationService: OrganizationService,
    private materialIconsService: MaterialIconsConfigService,
    private externalReferencesService: ExternalReferencesStoreAdapterService,
    private actions$: Actions
  ) {
    super();
  }

  ngOnInit() {
    this.materialIconsService.configureCustomIcons();
    this.ensureUserIsPartOfAnOrganization();
    this.notificationService.subscribeOnActions();
    this.roleOptionTypeService.subscribeOnActions();
    this.externalReferencesService.subscribeOnActions();
    this.setupAlertSubscriptions();
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
          this.store.dispatch(UserActions.resetOnOrganizationUpdate(organization ?? organizations[0]));
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

  private setupAlertSubscriptions() {
    this.actions$.pipe(ofType(UserActions.resetOnOrganizationUpdate)).subscribe(() => {
      this.store.dispatch(AlertActions.getAlerts(RelatedEntityType.ItSystemUsage));
      this.store.dispatch(AlertActions.getAlerts(RelatedEntityType.ItContract));
      this.store.dispatch(AlertActions.getAlerts(RelatedEntityType.DataProcessingRegistration));
    });
  }
}
