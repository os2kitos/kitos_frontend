import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { combineLatestWith, map, mergeMap, Observable, of, switchMap, tap, withLatestFrom } from 'rxjs';
import {
  APIItSystemUsageMigrationV2ResponseDTO,
  APIV2ItSystemUsageInternalINTERNALService,
  APIV2ItSystemUsageMigrationINTERNALService,
} from 'src/app/api/v2';
import {
  adaptItSystemUsageMigrationPermissions,
  ItSystemUsageMigrationPermissions,
} from 'src/app/shared/models/it-system-usage/migrations/it-system-usage-migration-permissions.model';
import {
  adaptItSystemUsageMigration,
  ItSystemUsageMigration,
} from 'src/app/shared/models/it-system-usage/migrations/it-system-usage-migration.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { IdentityNamePair, mapIdentityNamePair } from '../../../../models/identity-name-pair.model';
import { filterNullish } from '../../../../pipes/filter-nullish';

export interface GetMigrationModel {
  targetItSystemUuid: string;
  sourceItSystemUuid: string;
  usingOrganizationUuid: string;
}

interface State {
  loading: boolean;
  unusedItSystemsInOrganization: IdentityNamePair[] | undefined;
  migration: ItSystemUsageMigration | undefined;
  migrationPermissions: ItSystemUsageMigrationPermissions | undefined;
  usageUuid?: string;
}

@Injectable()
export class GridUsagesDialogComponentStore extends ComponentStore<State> {
  public readonly unusedItSystemsInOrganization$ = this.select((state) => state.unusedItSystemsInOrganization).pipe(
    filterNullish()
  );
  public readonly migration$ = this.select((state) => state.migration);
  public readonly loading$ = this.select((state) => state.loading);
  public readonly canExecuteMigration$ = this.allowExecuteMigration$();
  //Updated after getting consequenes
  public readonly usageUuid$ = this.select((state) => state.usageUuid);

  //28/11/24 The API endpoint expects a number from 1 to 25.
  private readonly numberOfItSystemsPerQuery = 25;
  private readonly executeMigrationCommandId = 'system-usage-migration_execute';

  constructor(
    @Inject(APIV2ItSystemUsageMigrationINTERNALService)
    private readonly itSystemUsageMigrationService: APIV2ItSystemUsageMigrationINTERNALService,
    @Inject(APIV2ItSystemUsageInternalINTERNALService)
    private readonly itSystemUsageInternalService: APIV2ItSystemUsageInternalINTERNALService,
    private notificationService: NotificationService,
    private store: Store
  ) {
    super({
      loading: false,
      unusedItSystemsInOrganization: undefined,
      migration: undefined,
      migrationPermissions: undefined,
    });
  }

  private allowExecuteMigration$() {
    return this.select(
      (state) =>
        state.migrationPermissions?.commands?.find((c) => c.id === this.executeMigrationCommandId)?.canExecute === true
    );
  }

  private updateLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    })
  );

  private updateUnusedItSystemsInOrganization = this.updater(
    (state, unusedItSystemsInOrganization: IdentityNamePair[]): State => ({
      ...state,
      unusedItSystemsInOrganization,
    })
  );

  private updateMigration = this.updater(
    (state, migration: ItSystemUsageMigration | undefined): State => ({
      ...state,
      migration,
    })
  );

  private updateMigrationPermissions = this.updater(
    (state, migrationPermissions: ItSystemUsageMigrationPermissions): State => ({
      ...state,
      migrationPermissions,
    })
  );

  private updateUsageUuid = this.updater(
    (state, usageUuid: string): State => ({
      ...state,
      usageUuid,
    })
  );

  public getMigrationPermissions = this.effect<void>((trigger$) =>
    trigger$.pipe(
      switchMap(() => {
        this.updateLoading(true);
        return this.itSystemUsageMigrationService.getSingleItSystemUsageMigrationV2GetPermissions().pipe(
          tapResponse(
            (permissionsDto) => {
              this.updateMigrationPermissions(adaptItSystemUsageMigrationPermissions(permissionsDto));
            },
            (error) => {
              console.error(error);
            },
            () => this.updateLoading(false)
          )
        );
      })
    )
  );
  public getMigration = this.effect((getModel: Observable<GetMigrationModel>) =>
    getModel.pipe(
      mergeMap(({ targetItSystemUuid, sourceItSystemUuid, usingOrganizationUuid }) =>
        this.getUsageUuid(usingOrganizationUuid, sourceItSystemUuid).pipe(
          mergeMap((usageUuid) => {
            this.updateLoading(true);
            this.updateUsageUuid(usageUuid);
            return this.itSystemUsageMigrationService.getSingleItSystemUsageMigrationV2Get({
              toSystemUuid: targetItSystemUuid,
              usageUuid,
            });
          }),
          tapResponse(
            //finally block is not working in this context for some reason
            (migrationDto: APIItSystemUsageMigrationV2ResponseDTO) => {
              this.updateMigration(adaptItSystemUsageMigration(migrationDto));
              this.updateLoading(false);
            },
            (error) => {
              console.error(error);
              this.updateLoading(false);
            }
          )
        )
      )
    )
  );

  public executeMigration = this.effect((targetItSystemUuid$: Observable<string>) =>
    targetItSystemUuid$.pipe(
      combineLatestWith(this.usageUuid$.pipe(filterNullish())),
      tap((_) => {
        this.updateLoading(true);
      }),
      tap(([targetItSystemUuid, usageUuid]) => {
        this.store.dispatch(ITSystemActions.executeUsageMigration(targetItSystemUuid, usageUuid));
      })
    )
  );

  public finishLoading = () => {
    this.updateLoading(false);
  };

  private getUsageUuid(usingOrganizationUuid: string, sourceItSystemUuid: string): Observable<string> {
    return this.itSystemUsageInternalService
      .getManyItSystemUsageInternalV2GetItSystemUsages({
        organizationUuid: usingOrganizationUuid,
      })
      .pipe(
        map((usages) => {
          const usage = usages.find((u) => u.systemContext.uuid === sourceItSystemUuid);
          if (!usage) {
            throw new Error('Usage not found');
          }
          return usage.uuid;
        })
      );
  }

  public getUnusedItSystemsInOrganization = (nameContent: string) =>
    this.effect((organizationUuid$: Observable<string>) =>
      organizationUuid$.pipe(
        withLatestFrom(of(nameContent)),
        mergeMap(([organizationUuid, nameContent]) => {
          this.updateLoading(true);
          return this.itSystemUsageMigrationService
            .getManyItSystemUsageMigrationV2GetUnusedItSystemsBySearchAndOrganization({
              organizationUuid,
              nameContent,
              numberOfItSystems: this.numberOfItSystemsPerQuery,
            })
            .pipe(
              tapResponse(
                (dtos) =>
                  this.updateUnusedItSystemsInOrganization(
                    dtos.map(mapIdentityNamePair).filter((x) => x !== undefined)
                  ),
                (error) => console.error(error),
                () => this.updateLoading(false)
              )
            );
        })
      )
    );
}
