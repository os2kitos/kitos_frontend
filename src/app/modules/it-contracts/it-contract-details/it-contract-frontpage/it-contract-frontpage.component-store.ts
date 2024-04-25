import { Injectable, OnDestroy } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { Observable, combineLatestWith, mergeMap, switchMap, tap } from 'rxjs';
import {
  APIIdentityNamePairResponseDTO,
  APIOrganizationResponseDTO,
  APIOrganizationUserResponseDTO,
  APIV2ItContractService,
  APIV2OrganizationService,
} from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItContractUuid } from 'src/app/store/it-contract/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  users?: APIOrganizationUserResponseDTO[];
  usersIsLoading: boolean;
  organizations?: APIOrganizationResponseDTO[];
  organizationsIsLoading: boolean;
  contractsLoading: boolean;
  contracts?: Array<APIIdentityNamePairResponseDTO>;
}

@Injectable()
export class ItContractFrontpageComponentStore extends ComponentStore<State> implements OnDestroy {
  public readonly users$ = this.select((state) => state.users).pipe(filterNullish());
  public readonly usersIsLoading$ = this.select((state) => state.usersIsLoading);
  public readonly organizations$ = this.select((state) => state.organizations).pipe(filterNullish());
  public readonly organizationsIsLoading$ = this.select((state) => state.organizationsIsLoading);
  public readonly contracts$ = this.select((state) => state.contracts).pipe(filterNullish());
  public readonly contractsIsLoading$ = this.select((state) => state.contractsLoading);

  constructor(
    private readonly organizationApiService: APIV2OrganizationService,
    private readonly apiItContractService: APIV2ItContractService,
    private readonly store: Store
  ) {
    super({ usersIsLoading: false, organizationsIsLoading: false, contractsLoading: false });
  }

  private updateUsers = this.updater(
    (state, users: APIOrganizationUserResponseDTO[]): State => ({
      ...state,
      users,
    })
  );

  private updateUsersIsLoading = this.updater(
    (state, isLoading: boolean): State => ({ ...state, usersIsLoading: isLoading })
  );

  private updateOrganizations = this.updater(
    (state, organizations: APIOrganizationResponseDTO[]): State => ({ ...state, organizations })
  );

  private updateOrganizationsIsLoading = this.updater(
    (state, isLoading: boolean): State => ({ ...state, organizationsIsLoading: isLoading })
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

  public searchUsersInOrganization = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([search, organizationUuid]) => {
        this.updateUsersIsLoading(true);
        return this.organizationApiService
          .getManyOrganizationV2GetOrganizationUsersByOrganizationuuid({
            organizationUuid,
            nameOrEmailQuery: search,
          })
          .pipe(
            tapResponse(
              (users) => this.updateUsers(users),
              (e) => console.error(e),
              () => this.updateUsersIsLoading(false)
            )
          );
      })
    )
  );

  public searchOrganizations = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      switchMap((search) => {
        this.updateOrganizationsIsLoading(true);
        return this.organizationApiService
          .getManyOrganizationV2GetOrganizations({
            nameOrCvrContent: search,
            orderByProperty: 'Name',
          })
          .pipe(
            tapResponse(
              (organizations) => this.updateOrganizations(organizations),
              (e) => console.error(e),
              () => this.updateOrganizationsIsLoading(false)
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
