import { NgModule, isDevMode } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EntityDataModule, EntityDataService } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { entityConfig } from './entity-metadata';
import { ITSystemDataService } from './it-system/it-system-data.service';
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
    }),
    StoreModule.forFeature(userFeature),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([UserEffects]),
    EntityDataModule.forRoot(entityConfig),
    RouterModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [ITSystemDataService],
})
export class RootStoreModule {
  constructor(entityDataService: EntityDataService, itSystemDataService: ITSystemDataService) {
    entityDataService.registerServices({ ITSystem: itSystemDataService });
  }
}
