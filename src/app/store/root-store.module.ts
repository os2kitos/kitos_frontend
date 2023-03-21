import { isDevMode, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BusinessTypeEffects } from './business-type/effects';
import { businessTypeFeature } from './business-type/reducer';
import { ContractTypeEffects } from './contract-type/effects';
import { contractTypeFeature } from './contract-type/reducer';
import { DataClassificationTypeEffects } from './data-classification-type/effects';
import { dataClassificationTypeFeature } from './data-classification-type/reducer';
import { InterfaceTypeEffects } from './it-interface-type/effects';
import { interfaceTypeFeature } from './it-interface-type/reducer';
import { ITSystemUsageEffects } from './it-system-usage/effects';
import { itSystemUsageFeature } from './it-system-usage/reducer';
import { ITSystemEffects } from './it-system/effects';
import { itSystemFeature } from './it-system/reducer';
import { KLEEffects } from './kle/effects';
import { kleFeature } from './kle/reducer';
import { localStorageSyncReducer } from './meta/local-storage-sync.reducer';
import { resetReducer } from './meta/reset.reducer';
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
    StoreModule.forFeature(contractTypeFeature),
    StoreModule.forFeature(kleFeature),
    StoreModule.forFeature(interfaceTypeFeature),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([
      UserEffects,
      ITSystemUsageEffects,
      ITSystemEffects,
      DataClassificationTypeEffects,
      BusinessTypeEffects,
      KLEEffects,
      ContractTypeEffects,
      InterfaceTypeEffects,
    ]),
    RouterModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [],
})
export class RootStoreModule {}
