import { isDevMode, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ITSystemUsageEffects } from './it-system-usage/effects';
import { itSystemUsageFeature } from './it-system-usage/reducer';
import { ITSystemEffects } from './it-system/effects';
import { itSystemFeature } from './it-system/reducer';
import { KLEEffects } from './kle/effects';
import { kleFeature } from './kle/reducer';
import { localStorageSyncReducer } from './meta/local-storage-sync.reducer';
import { resetReducer } from './meta/reset.reducer';
import { notificationsFeature } from './notifications/reducer';
import { OrganizationUnitEffects } from './organization-unit/effects';
import { organizationUnitFeature } from './organization-unit/reducer';
import { RegularOptionTypeEffects } from './regular-option-type-store/effects';
import { regularOptionTypeFeature } from './regular-option-type-store/reducer';
import { UserEffects } from './user-store/effects';
import { userFeature } from './user-store/reducer';

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
      metaReducers: [resetReducer, localStorageSyncReducer],
    }),
    StoreModule.forFeature(userFeature),
    StoreModule.forFeature(itSystemUsageFeature),
    StoreModule.forFeature(itSystemFeature),
    StoreModule.forFeature(kleFeature),
    StoreModule.forFeature(regularOptionTypeFeature),
    StoreModule.forFeature(notificationsFeature),
    StoreModule.forFeature(organizationUnitFeature),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([
      UserEffects,
      ITSystemUsageEffects,
      ITSystemEffects,
      KLEEffects,
      RegularOptionTypeEffects,
      OrganizationUnitEffects,
    ]),
    RouterModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [],
})
export class RootStoreModule {}
