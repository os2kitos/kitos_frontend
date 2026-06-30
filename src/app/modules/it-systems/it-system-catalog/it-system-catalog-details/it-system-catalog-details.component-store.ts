import { Inject, Injectable } from '@angular/core';
import { concatLatestFrom, tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { first, mergeMap } from 'rxjs';
import { ItSystemUsageV2Service } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectITSystemUsageHasDeletePermission } from 'src/app/store/it-system-usage/selectors';
import { selectItSystemUuid } from 'src/app/store/it-system/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { ITSystemCatalogComponentStore } from '../it-system-catalog.component-store';

@Injectable()
export class ITSystemCatalogDetailsComponentStore extends ITSystemCatalogComponentStore {
  public readonly usageModifyPermission$ = this.store
    .select(selectITSystemUsageHasDeletePermission)
    .pipe(filterNullish());

  constructor(@Inject(ItSystemUsageV2Service) apiItSystemUsageService: ItSystemUsageV2Service, store: Store) {
    super(apiItSystemUsageService, store);
  }

  public getUsageDeletePermissionsForItSystem = this.effect(() =>
    this.store.select(selectItSystemUuid).pipe(
      filterNullish(),
      first(),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([itSystemUuid, organizationUuid]) =>
        this.apiItSystemUsageService
          .getSingleItSystemUsageV2GetItSystemUsages({ systemUuid: itSystemUuid, organizationUuid })
          .pipe(
            tapResponse({
              next: (usages) => {
                if (usages.length > 1)
                  console.error(
                    `More than one usage found for it system ${itSystemUuid} and organization ${organizationUuid}`,
                  );
                const usage = usages[0];
                if (!usage) return;
                const usageUuid = usage.uuid;
                this.store.dispatch(ITSystemUsageActions.getITSystemUsagePermissions(usageUuid));
              },
              error: (e) => console.error(e),
            }),
          ),
      ),
    ),
  );
}
