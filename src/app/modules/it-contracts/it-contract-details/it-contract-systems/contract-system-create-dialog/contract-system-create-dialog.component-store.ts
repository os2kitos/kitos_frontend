import { Injectable, OnDestroy } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { Observable, combineLatestWith, mergeMap, tap } from 'rxjs';
import { APIIdentityNamePairResponseDTO, APIV2ItSystemUsageInternalINTERNALService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  systemUsages?: Array<APIIdentityNamePairResponseDTO>;
  systemUsagesIsLoading: boolean;
}

@Injectable()
export class ItContractSystemCreateDialogComponentStore extends ComponentStore<State> implements OnDestroy {
  public readonly systemUsages$ = this.select((state) => state.systemUsages).pipe(filterNullish());
  public readonly systemUsagesIsLoading$ = this.select((state) => state.systemUsagesIsLoading);

  constructor(
    private readonly systemUsageService: APIV2ItSystemUsageInternalINTERNALService,
    private readonly store: Store
  ) {
    super({ systemUsagesIsLoading: false });
  }

  private updateSystemUsages = this.updater(
    (state, systemUsages: APIIdentityNamePairResponseDTO[]): State => ({
      ...state,
      systemUsages,
    })
  );

  private updateSystemUsagesIsLoading = this.updater(
    (state, systemUsagesIsLoading: boolean): State => ({ ...state, systemUsagesIsLoading })
  );

  public searchSystemUsages = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.updateSystemUsagesIsLoading(true)),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([search, organizationUuid]) => {
        return this.systemUsageService
          .getManyItSystemUsageInternalV2GetItSystemUsages({
            organizationUuid,
            systemNameContent: search,
          })
          .pipe(
            tapResponse(
              (usages) =>
                this.updateSystemUsages(usages.map((usage) => ({ uuid: usage.uuid, name: usage.systemContext.name }))),
              (e) => console.error(e),
              () => this.updateSystemUsagesIsLoading(false)
            )
          );
      })
    )
  );
}
