import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { combineLatestWith, mergeMap, Observable, tap } from 'rxjs';
import { APIItContractResponseDTO, ItContractV2Service } from 'src/app/api/v2';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  contracts: APIItContractResponseDTO[];
  loading: boolean;
}

@Injectable()
export class ContractDropdownComponentStore extends ComponentStore<State> {
  public readonly contracts$ = this.select((state) => state.contracts);
  public readonly loading$ = this.select((state) => state.loading);

  constructor(
    @Inject(ItContractV2Service) private readonly itContractService: ItContractV2Service,
    private readonly store: Store,
  ) {
    super({ contracts: [], loading: false });
  }

  private setContracts = this.updater(
    (state, contracts: APIItContractResponseDTO[]): State => ({
      ...state,
      contracts,
    }),
  );

  private setLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    }),
  );

  public searchContracts = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.setLoading(true)),
      combineLatestWith(this.store.select(selectOrganizationUuid)),
      mergeMap(([search, organizationUuid]) => {
        return this.itContractService.getManyItContractV2GetItContracts({ nameContent: search, organizationUuid }).pipe(
          tapResponse({
            next: (contracts) => this.setContracts(contracts),
            error: (error) => console.error(error),
            complete: () => this.setLoading(false),
          }),
        );
      }),
    ),
  );
}
