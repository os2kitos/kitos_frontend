import { isDevMode, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EntityDataModule, EntityDataService } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { entityConfig } from './entity-metadata';
import { ITSystemUsageEffects } from './it-system-usage/effects';
import { itSystemUsageFeature } from './it-system-usage/reducer';
import { localStorageSyncReducer } from './local-storage-sync-reducer';
import { OrganizationDataService } from './organization/organization-data.service';
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
      metaReducers: [localStorageSyncReducer],
    }),
    StoreModule.forFeature(userFeature),
    StoreModule.forFeature(itSystemUsageFeature),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([UserEffects, ITSystemUsageEffects]),
    EntityDataModule.forRoot(entityConfig),
    RouterModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [OrganizationDataService],
})
export class RootStoreModule {
  constructor(entityDataService: EntityDataService, organizationDataService: OrganizationDataService) {
    entityDataService.registerServices({ Organization: organizationDataService });
  }
}
