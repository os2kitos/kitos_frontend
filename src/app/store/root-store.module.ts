import { isDevMode, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DataProcessingEffects } from './data-processing/effects';
import { dataProcessingFeature } from './data-processing/reducer';
import { GlobalAdminOptionTypeEffects } from './global-admin/global-option-types/effects';
import { GridExportEffects } from './grid/effects';
import { exportFeature } from './grid/reducer';
import { ITContractEffects } from './it-contract/effects';
import { itContractFeature } from './it-contract/reducer';
import { ITInterfaceEffects } from './it-system-interfaces/effects';
import { itInterfaceFeature } from './it-system-interfaces/reducer';
import { ITSystemUsageEffects } from './it-system-usage/effects';
import { itSystemUsageFeature } from './it-system-usage/reducer';
import { ITSystemEffects } from './it-system/effects';
import { itSystemFeature } from './it-system/reducer';
import { KLEEffects } from './kle/effects';
import { kleFeature } from './kle/reducer';
import { FkOrgEffects } from './local-admin/fk-org/effects';
import { fkOrgFeature } from './local-admin/fk-org/reducer';
import { LocalOptionTypeEffects } from './local-admin/local-option-types/effects';
import { exportReadyMetaReducer } from './meta/grid-export.reducer';
import { localStorageSyncReducer } from './meta/local-storage-sync.reducer';
import { resetReducer } from './meta/reset.reducer';
import { OrganizationEffects } from './organization/effects';
import { OrganizationUnitEffects } from './organization/organization-unit/effects';
import { organizationUnitFeature } from './organization/organization-unit/reducer';
import { OrganizationUserEffects } from './organization/organization-user/effects';
import { organizationUserFeature } from './organization/organization-user/reducer';
import { organizationFeature } from './organization/reducer';
import { UIModuleCustomizationEffects } from './organization/ui-module-customization/effects';
import { uiModuleConfigFeature } from './organization/ui-module-customization/reducer';
import { popupMessagesFeature } from './popup-messages/reducer';
import { RegularOptionTypeEffects } from './regular-option-type-store/effects';
import { regularOptionTypeFeature } from './regular-option-type-store/reducer';
import { RoleOptionTypeEffects } from './roles-option-type-store/effects';
import { roleOptionTypeFeature } from './roles-option-type-store/reducer';
import { UserEffects } from './user-store/effects';
import { userFeature } from './user-store/reducer';
import { globalAdminFeature } from './global-admin/reducers';
import { helpTextFeature } from './global-admin/help-texts/reducer';
import { GlobalAdminHelpTextsEffects } from './global-admin/help-texts/effects';
import { GlobalAdminEffects } from './global-admin/effects';
import { localAdminUsersFeature } from './global-admin/local-admins/reducers';
import { LocalAdminUserEffects } from './global-admin/local-admins/effects';
import { PublicMessageEffects } from './global-admin/public-messages/effects';
import { gdprReportFeature } from './it-system-usage/gdpr-report/reducer';
import { GdprReportEffects } from './it-system-usage/gdpr-report/effects';
import { notificationFeature } from './user-notifications/reducer';
import { UserNotificationsEffects } from './user-notifications/effects';
import { alertsFeature } from './alerts/reducers';
import { AlertsEffects } from './alerts/effects';

@NgModule({
  imports: [
    StoreModule.forRoot([], {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      },
      metaReducers: [resetReducer, localStorageSyncReducer, exportReadyMetaReducer],
    }),
    StoreModule.forFeature(userFeature),
    StoreModule.forFeature(itSystemUsageFeature),
    StoreModule.forFeature(itSystemFeature),
    StoreModule.forFeature(itContractFeature),
    StoreModule.forFeature(kleFeature),
    StoreModule.forFeature(regularOptionTypeFeature),
    StoreModule.forFeature(popupMessagesFeature),
    StoreModule.forFeature(organizationUnitFeature),
    StoreModule.forFeature(roleOptionTypeFeature),
    StoreModule.forFeature(itInterfaceFeature),
    StoreModule.forFeature(dataProcessingFeature),
    StoreModule.forFeature(exportFeature),
    StoreModule.forFeature(organizationUserFeature),
    StoreModule.forFeature(organizationFeature),
    StoreModule.forFeature(uiModuleConfigFeature),
    StoreModule.forFeature(fkOrgFeature),
    StoreModule.forFeature(globalAdminFeature),
    StoreModule.forFeature(helpTextFeature),
    StoreModule.forFeature(localAdminUsersFeature),
    StoreModule.forFeature(gdprReportFeature),
    StoreModule.forFeature(notificationFeature),
    StoreModule.forFeature(alertsFeature),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([
      UserEffects,
      ITSystemUsageEffects,
      ITSystemEffects,
      ITContractEffects,
      KLEEffects,
      RegularOptionTypeEffects,
      OrganizationUnitEffects,
      RoleOptionTypeEffects,
      ITInterfaceEffects,
      DataProcessingEffects,
      GridExportEffects,
      OrganizationUserEffects,
      OrganizationEffects,
      UIModuleCustomizationEffects,
      LocalOptionTypeEffects,
      FkOrgEffects,
      GlobalAdminOptionTypeEffects,
      GlobalAdminHelpTextsEffects,
      GlobalAdminEffects,
      LocalAdminUserEffects,
      PublicMessageEffects,
      GdprReportEffects,
      UserNotificationsEffects,
      AlertsEffects,
    ]),
    RouterModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode(), connectInZone: true }),
  ],
  providers: [],
})
export class RootStoreModule {}
