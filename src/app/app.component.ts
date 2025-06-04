import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { ChooseOrganizationComponent } from './modules/layout/choose-organization/choose-organization.component';
import { BaseComponent } from './shared/base/base.component';
import { ExternalReferencesStoreAdapterService } from './shared/services/external-references-store-adapter.service';
import { MaterialIconsConfigService } from './shared/services/material-icons-config.service';
import { NotificationService } from './shared/services/notification.service';
import { OrganizationService } from './shared/services/organization.service';
import { RoleOptionTypeService } from './shared/services/role-option-type.service';
import { AlertActions } from './store/alerts/actions';
import { RelatedEntityType } from './store/alerts/state';
import { UserActions } from './store/user-store/actions';
import { selectIsAuthenticating, selectUser } from './store/user-store/selectors';
import { NgIf, AsyncPipe } from '@angular/common';
import { NavBarComponent } from './modules/layout/nav-bar/nav-bar.component';
import { RouterOutlet } from '@angular/router';
import { PopupMessagesComponent } from './shared/components/popup-messages/popup-messages.component';
import { LoadingComponent } from './shared/components/loading/loading.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [NgIf, NavBarComponent, LoadingComponent, RouterOutlet, PopupMessagesComponent, AsyncPipe],
})
export class AppComponent extends BaseComponent implements OnInit {
  public isAuthenticating$ = this.store.select(selectIsAuthenticating);
  public isAuthenticated$ = this.store.select(selectUser).pipe(map((user) => !!user));

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
          const currentOrganization = organization ?? organizations[0];
          this.store.dispatch(UserActions.resetOnOrganizationUpdate(currentOrganization));
          this.store.dispatch(UserActions.getUserDefaultUnit(currentOrganization.uuid));
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
