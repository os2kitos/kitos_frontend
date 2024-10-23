import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ChooseOrganizationComponent } from './modules/layout/choose-organization/choose-organization.component';
import { BaseComponent } from './shared/base/base.component';
import { UIModuleConfigKey } from './shared/enums/ui-module-config-key';
import { ExternalReferencesStoreAdapterService } from './shared/services/external-references-store-adapter.service';
import { MaterialIconsConfigService } from './shared/services/material-icons-config.service';
import { NotificationService } from './shared/services/notification.service';
import { OrganizationService } from './shared/services/organization.service';
import { RoleOptionTypeService } from './shared/services/role-option-type.service';
import { UIModuleConfigActions } from './store/organization/ui-module-customization/actions';
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
    private roleOptionTypeService: RoleOptionTypeService,
    private dialog: MatDialog,
    private organizationService: OrganizationService,
    private materialIconsService: MaterialIconsConfigService,
    private externalReferencesService: ExternalReferencesStoreAdapterService
  ) {
    super();
  }

  ngOnInit() {
    this.materialIconsService.configureCustomIcons();
    this.ensureUserIsPartOfAnOrganization();
    this.notificationService.subscribeOnActions();
    this.roleOptionTypeService.subscribeOnActions();
    this.externalReferencesService.subscribeOnActions();
    this.getUIModuleConfig();
  }

  private getUIModuleConfig() {
    this.store.dispatch(
      UIModuleConfigActions.getUIModuleConfig({
        module: UIModuleConfigKey.ItSystemUsage,
      })
    );
    this.store.dispatch(
      UIModuleConfigActions.getUIModuleConfig({
        module: UIModuleConfigKey.DataProcessingRegistrations,
      })
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
}
