import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map, mergeMap, tap } from 'rxjs';
import {
  APIIdentityNamePairResponseDTO,
  APIItContractResponseDTO,
  APIItInterfaceResponseDTO,
  APIV2ItContractService,
  APIV2ItInterfaceService,
  APIV2ItSystemUsageInternalINTERNALService,
  APIV2ItSystemUsageService,
} from 'src/app/api/v2';
import { BOUNDED_PAGINATION_QUERY_MAX_SIZE } from 'src/app/shared/constants';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItSystemUsageUuid } from 'src/app/store/it-system-usage/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  systemUuidLoading: boolean;
  systemUuid?: string;
  usagesLoading: boolean;
  systemUsages?: Array<APIIdentityNamePairResponseDTO>;
  interfacesLoading: boolean;
  interfaces?: Array<APIItInterfaceResponseDTO>;
  contractsLoading: boolean;
  contracts?: Array<APIItContractResponseDTO>;
}
@Injectable()
export class ItSystemUsageDetailsRelationsDialogComponentStore extends ComponentStore<State> {
  public readonly PAGE_SIZE = BOUNDED_PAGINATION_QUERY_MAX_SIZE;

  public readonly systemUuid$ = this.select((state) => state.systemUuid).pipe(filterNullish());

  public readonly systemUsages$ = this.select((state) => state.systemUsages).pipe(filterNullish());
  public readonly isSystemUsagesLoading$ = this.select((state) => state.usagesLoading).pipe(filterNullish());

  public readonly contracts$ = this.select((state) => state.contracts).pipe(filterNullish());
  public readonly contractsLoading$ = this.select((state) => state.contractsLoading).pipe(filterNullish());

  public readonly interfaces$ = this.select((state) => state.interfaces).pipe(filterNullish());

  private readonly interfacesLoading$ = this.select((state) => state.contractsLoading).pipe(filterNullish());
  private readonly systemUuidLoading$ = this.select((state) => state.systemUuidLoading).pipe(filterNullish());

  public readonly isInterfacesOrSystemUuidLoading$ = combineLatest([
    this.interfacesLoading$,
    this.systemUuidLoading$,
  ]).pipe(map(([interfaceLoading, systemUuidLoading]) => interfaceLoading || systemUuidLoading));

  constructor(
    private readonly store: Store,
    private readonly apiUsageService: APIV2ItSystemUsageService,
    private readonly apiInternalUsageService: APIV2ItSystemUsageInternalINTERNALService,
    private readonly apiInterfaceService: APIV2ItInterfaceService,
    private readonly apiContractService: APIV2ItContractService
  ) {
    super({ systemUuidLoading: false, usagesLoading: false, interfacesLoading: false, contractsLoading: false });
  }

  private updateSystemUuid = this.updater(
    (state, systemUuid: string | undefined): State => ({
      ...state,
      systemUuid,
    })
  );

  private updateSystemUuidIsLoading = this.updater(
    (state, systemUuidLoading: boolean): State => ({
      ...state,
      systemUuidLoading,
    })
  );

  private updateSystemUsages = this.updater(
    (state, systemUsages: Array<APIIdentityNamePairResponseDTO>): State => ({
      ...state,
      systemUsages,
    })
  );

  private updateSystemUsagesIsLoading = this.updater(
    (state, usagesLoading: boolean): State => ({
      ...state,
      usagesLoading,
    })
  );

  private updateInterfaces = this.updater(
    (state, interfaces: Array<APIItInterfaceResponseDTO>): State => ({
      ...state,
      interfaces,
    })
  );

  private updateInterfacesIsLoading = this.updater(
    (state, interfacesListIsLoading: boolean): State => ({
      ...state,
      interfacesLoading: interfacesListIsLoading,
    })
  );

  private updateContracts = this.updater(
    (state, contracts: Array<APIItContractResponseDTO>): State => ({
      ...state,
      contracts,
    })
  );

  private updateContractsIsLoading = this.updater(
    (state, contractsListIsLoading: boolean): State => ({
      ...state,
      contractsLoading: contractsListIsLoading,
    })
  );

  public updateCurrentSystemUuid(usageUuid: string | undefined) {
    if (!usageUuid) {
      this.updateSystemUuid(undefined);
    } else {
      this.getSystemUuid(usageUuid);
    }
  }

  public getSystemUuid = this.effect((usageUuid$: Observable<string>) =>
    usageUuid$.pipe(
      tap(() => this.updateSystemUuidIsLoading(true)),
      mergeMap((usageUuid) => {
        return this.apiUsageService.getSingleItSystemUsageV2GetItSystemUsage({ systemUsageUuid: usageUuid }).pipe(
          tapResponse(
            (usage) => this.updateSystemUuid(usage.systemContext.uuid),
            (error) => console.error(error),
            () => this.updateSystemUuidIsLoading(false)
          )
        );
      })
    )
  );

  public getItSystemUsages = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.updateSystemUsagesIsLoading(true)),
      concatLatestFrom(() => [
        this.store.select(selectOrganizationUuid).pipe(filterNullish()),
        this.store.select(selectItSystemUsageUuid),
      ]),
      mergeMap(([search, organizationUuid, currentUsageUuid]) => {
        return this.apiInternalUsageService
          .getManyItSystemUsageInternalV2GetItSystemUsages({
            organizationUuid: organizationUuid,
            systemNameContent: search,
          })
          .pipe(
            tapResponse(
              (usages) => {
                return this.updateSystemUsages(
                  usages
                    .filter((usage) => usage.uuid != currentUsageUuid)
                    .map((usage) => ({
                      name: usage.systemContext.name,
                      uuid: usage.uuid,
                    }))
                );
              },
              (error) => console.error(error),
              () => this.updateSystemUsagesIsLoading(false)
            )
          );
      })
    )
  );

  public getItInterfaces = this.effect((params$: Observable<{ systemUuid: string; search: string | undefined }>) =>
    params$.pipe(
      tap(() => this.updateInterfacesIsLoading(true)),
      mergeMap((params) => {
        return this.apiInterfaceService
          .getManyItInterfaceV2GetItInterfaces({
            nameContains: params.search,
            exposedBySystemUuid: params.systemUuid,
            includeDeactivated: true,
          })
          .pipe(
            tapResponse(
              (interfaces) => this.updateInterfaces(interfaces),
              (error) => console.error(error),
              () => this.updateInterfacesIsLoading(false)
            )
          );
      })
    )
  );

  public getItContracts = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.updateContractsIsLoading(true)),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([search, organizationUuid]) => {
        return this.apiContractService
          .getManyItContractV2GetItContracts({
            nameContent: search,
            organizationUuid: organizationUuid,
            pageSize: this.PAGE_SIZE,
          })
          .pipe(
            tapResponse(
              (contracts) => this.updateContracts(contracts),
              (error) => console.error(error),
              () => this.updateContractsIsLoading(false)
            )
          );
      })
    )
  );
}
