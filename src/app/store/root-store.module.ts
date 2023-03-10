import { isDevMode, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EntityDataModule, EntityDataService } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BusinessTypeEffects } from './business-type/effects';
import { businessTypeFeature } from './business-type/reducer';
import { DataClassificationTypeEffects } from './data-classification-type/effects';
import { dataClassificationTypeFeature } from './data-classification-type/reducer';
import { entityConfig } from './entity-metadata';
import { ITSystemUsageEffects } from './it-system-usage/effects';
import { itSystemUsageFeature } from './it-system-usage/reducer';
import { ITSystemEffects } from './it-system/effects';
import { itSystemFeature } from './it-system/reducer';
import { KLEEffects } from './kle/effects';
import { kleFeature } from './kle/reducer';
import { localStorageSyncReducer } from './meta/local-storage-sync.reducer';
import { resetReducer } from './meta/reset.reducer';
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
      metaReducers: [resetReducer, localStorageSyncReducer],
    }),
    StoreModule.forFeature(userFeature),
    StoreModule.forFeature(itSystemUsageFeature),
    StoreModule.forFeature(itSystemFeature),
    StoreModule.forFeature(dataClassificationTypeFeature),
    StoreModule.forFeature(businessTypeFeature),
    StoreModule.forFeature(kleFeature),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([
      UserEffects,
      ITSystemUsageEffects,
      ITSystemEffects,
      DataClassificationTypeEffects,
      BusinessTypeEffects,
      KLEEffects,
    ]),
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
