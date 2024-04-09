import { Injectable, OnDestroy } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { Observable, combineLatestWith, map, mergeMap, tap } from 'rxjs';
import {
  APIGeneralSystemRelationResponseDTO,
  APIIdentityNamePairResponseDTO,
  APIV2ItSystemUsageInternalINTERNALService,
} from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItContractSystemUsages, selectItContractUuid } from 'src/app/store/it-contract/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  systemRelations?: Array<APIGeneralSystemRelationResponseDTO>;
  systemRelationsIsLoading: boolean;
  systemUsages?: Array<APIIdentityNamePairResponseDTO>;
  systemUsagesIsLoading: boolean;
}

@Injectable()
export class ItContractSystemsComponentStore extends ComponentStore<State> implements OnDestroy {
  public readonly systemRelations$ = this.select((state) => state.systemRelations).pipe(
    filterNullish(),
    combineLatestWith(this.store.select(selectItContractSystemUsages).pipe(filterNullish())),
    // eslint-disable-next-line @ngrx/avoid-mapping-component-store-selectors
    map(([systemUsages, contractSystemUsages]) =>
      systemUsages.filter(
        (systemUsage) =>
          !contractSystemUsages.some((contractSystemUsage) => contractSystemUsage.uuid === systemUsage.uuid)
      )
    )
  );
  public readonly systemRelationsIsLoading$ = this.select((state) => state.systemRelationsIsLoading);
  public readonly systemUsages$ = this.select((state) => state.systemUsages).pipe(filterNullish());
  public readonly systemUsagesIsLoading$ = this.select((state) => state.systemUsagesIsLoading);

  constructor(
    private readonly systemUsageService: APIV2ItSystemUsageInternalINTERNALService,
    private readonly store: Store
  ) {
    super({ systemRelationsIsLoading: false, systemUsagesIsLoading: false });
  }

  private updateSystemRelations = this.updater(
    (state, systemRelations: APIGeneralSystemRelationResponseDTO[]): State => ({
      ...state,
      systemRelations,
    })
  );

  private updateSystemRelationsIsLoading = this.updater(
    (state, systemRelationsIsLoading: boolean): State => ({ ...state, systemRelationsIsLoading })
  );

  private updateSystemUsages = this.updater(
    (state, systemUsages: APIIdentityNamePairResponseDTO[]): State => ({
      ...state,
      systemUsages,
    })
  );

  private updateSystemUsagesIsLoading = this.updater(
    (state, systemUsagesIsLoading: boolean): State => ({ ...state, systemUsagesIsLoading })
  );

  public getSystemRelations = this.effect(() =>
    this.store.select(selectItContractUuid).pipe(
      filterNullish(),
      tap(() => this.updateSystemRelationsIsLoading(true)),
      mergeMap((itContractUuid) => {
        return this.systemUsageService
          .getManyItSystemUsageInternalV2GetRelations({ contractUuid: itContractUuid })
          .pipe(
            tapResponse(
              (relations) => this.updateSystemRelations(relations),
              (e) => console.error(e),
              () => this.updateSystemRelationsIsLoading(false)
            )
          );
      })
    )
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
