import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap } from 'rxjs';
import { APIV2ItSystemUsageService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectITSystemUsageHasDeletePermission } from 'src/app/store/it-system-usage/selectors';
import { selectItSystemUuid } from 'src/app/store/it-system/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {}

@Injectable()
export class ITSystemCatalogDetailsComponentStore extends ComponentStore<State> {
  public readonly usageModifyPermission$ = this.select(selectITSystemUsageHasDeletePermission).pipe(filterNullish());

  constructor(private apiItSystemUsageService: APIV2ItSystemUsageService, private store: Store) {
    super();
  }

  public getUsageDeletePermissionsForItSystem = this.effect<string>(() =>
    this.store.select(selectItSystemUuid).pipe(
      concatLatestFrom(() => this.store.select(selectOrganizationUuid)),
      mergeMap(([itSystemUuid, organizationUuid]) =>
        this.apiItSystemUsageService
          .getManyItSystemUsageV2GetItSystemUsages({ systemUuid: itSystemUuid, organizationUuid })
          .pipe(
            tapResponse(
              (usages) => {
                const usage = usages[0];
                if (!usage) return;

                const usageUuid = usage.uuid;
                this.store.dispatch(ITSystemUsageActions.getITSystemUsagePermissions(usageUuid));
              },
              (e) => console.error(e)
            )
          )
      )
    )
  );
}
