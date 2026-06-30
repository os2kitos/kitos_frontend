import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { concatLatestFrom, tapResponse } from '@ngrx/operators';

import { Store } from '@ngrx/store';
import { first, mergeMap, Observable, of } from 'rxjs';
import { ItSystemUsageV2Service } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItSystemUuid } from 'src/app/store/it-system/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  systemUsageUuid: string | undefined;
}

@Injectable()
export class ITSystemCatalogComponentStore extends ComponentStore<State> {
  public readonly systemUsageUuid$ = this.select((state) => state.systemUsageUuid);

  constructor(
    @Inject(ItSystemUsageV2Service) protected apiItSystemUsageService: ItSystemUsageV2Service,
    protected store: Store,
  ) {
    super({ systemUsageUuid: undefined });
  }

  private setSystemUsageUuid = this.updater(
    (state, systemUsageUuid: string | undefined): State => ({
      ...state,
      systemUsageUuid,
    }),
  );

  public getSystemUsageUuidByItSystemAndOrganization = this.effect((systemUuid$: Observable<string | undefined>) =>
    systemUuid$.pipe(
      mergeMap((systemUuid) =>
        (systemUuid ? of(systemUuid) : this.store.select(selectItSystemUuid).pipe(filterNullish())).pipe(
          first(),
          concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
          mergeMap(([itSystemUuid, organizationUuid]) =>
            this.apiItSystemUsageService
              .getSingleItSystemUsageV2GetItSystemUsages({
                systemUuid: itSystemUuid,
                organizationUuid,
              })
              .pipe(
                tapResponse({
                  next: (usages) => {
                    if (usages.length > 1)
                      console.error(
                        `More than one usage found for it system ${itSystemUuid} and organization ${organizationUuid}`,
                      );
                    const usage = usages[0];
                    if (!usage?.uuid) return;
                    this.setSystemUsageUuid(usage.uuid);
                  },
                  error: (e) => console.error(e),
                }),
              ),
          ),
        ),
      ),
    ),
  );
}
