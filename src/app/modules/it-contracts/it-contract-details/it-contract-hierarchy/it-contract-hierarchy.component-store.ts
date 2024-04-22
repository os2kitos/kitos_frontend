import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { Observable, combineLatestWith, mergeMap, tap } from 'rxjs';
import {
  APIIdentityNamePairResponseDTO,
  APIRegistrationHierarchyNodeWithActivationStatusResponseDTO,
  APIV2ItContractInternalINTERNALService,
  APIV2ItContractService,
} from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItContractUuid } from 'src/app/store/it-contract/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  loading: boolean;
  hierarchy?: Array<APIRegistrationHierarchyNodeWithActivationStatusResponseDTO>;
  contractsLoading: boolean;
  contracts?: Array<APIIdentityNamePairResponseDTO>;
}

@Injectable()
export class ItContractHierarchyComponentStore extends ComponentStore<State> {
  public readonly hierarchy$ = this.select((state) => state.hierarchy).pipe(filterNullish());
  public readonly isLoading$ = this.select((state) => state.loading);
  public readonly contracts$ = this.select((state) => state.contracts).pipe(filterNullish());
  public readonly contractsLoading$ = this.select((state) => state.contractsLoading);

  constructor(
    private apiItContractInternalService: APIV2ItContractInternalINTERNALService,
    private apiItContractService: APIV2ItContractService,
    private store: Store
  ) {
    super({ loading: false, contractsLoading: false });
  }

  private updateHierarchy = this.updater(
    (state, hierarchy: Array<APIRegistrationHierarchyNodeWithActivationStatusResponseDTO>): State => ({
      ...state,
      hierarchy,
    })
  );

  private updateIsLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    })
  );

  private updateContracts = this.updater(
    (state, contracts: Array<APIIdentityNamePairResponseDTO>): State => ({
      ...state,
      contracts,
    })
  );

  private updateContractsLoading = this.updater(
    (state, contractsLoading: boolean): State => ({
      ...state,
      contractsLoading,
    })
  );

  public getHierarchy = this.effect((itContractUuid$: Observable<string>) =>
    itContractUuid$.pipe(
      mergeMap((uuid) => {
        this.updateIsLoading(true);
        return this.apiItContractInternalService.getManyItContractInternalV2GetHierarchy({ contractUuid: uuid }).pipe(
          tapResponse(
            (hierarchy) => this.updateHierarchy(hierarchy),
            (e) => console.error(e),
            () => this.updateIsLoading(false)
          )
        );
      })
    )
  );

  public searchContracts = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.updateContractsLoading(true)),
      combineLatestWith(
        this.store.select(selectOrganizationUuid).pipe(filterNullish()),
        this.store.select(selectItContractUuid).pipe(filterNullish())
      ),
      mergeMap(([search, organizationUuid, contractUuid]) => {
        return this.apiItContractService
          .getManyItContractV2GetItContracts({ organizationUuid, nameContent: search })
          .pipe(
            tapResponse(
              (contracts) => this.updateContracts(contracts.filter((contract) => contract.uuid !== contractUuid)),
              (e) => console.error(e),
              () => this.updateContractsLoading(false)
            )
          );
      })
    )
  );
}
