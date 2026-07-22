import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';

import { Store } from '@ngrx/store';
import { Observable, combineLatestWith, mergeMap, switchMap, tap } from 'rxjs';
import {
  APIOrganizationResponseDTO,
  APIOrganizationUserResponseDTO,
  ItContractV2Service,
  OrganizationV2Service,
} from 'src/app/api/v2';
import {
  mapContractsToTree,
  mapTreeToIdentityNamePairs,
  removeNodeAndChildren,
} from 'src/app/shared/helpers/hierarchy.helpers';
import { IdentityNamePair } from 'src/app/shared/models/identity-name-pair.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItContractUuid } from 'src/app/store/it-contract/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  users?: APIOrganizationUserResponseDTO[];
  usersIsLoading: boolean;
  organizations?: APIOrganizationResponseDTO[];
  organizationsIsLoading: boolean;
  contractsLoading: boolean;
  validParentContracts?: IdentityNamePair[];
}

@Injectable()
export class ItContractFrontpageComponentStore extends ComponentStore<State> implements OnDestroy {
  public readonly users$ = this.select((state) => state.users).pipe(filterNullish());
  public readonly usersIsLoading$ = this.select((state) => state.usersIsLoading);
  public readonly organizations$ = this.select((state) => state.organizations).pipe(filterNullish());
  public readonly organizationsIsLoading$ = this.select((state) => state.organizationsIsLoading);
  public readonly contractsIsLoading$ = this.select((state) => state.contractsLoading);
  public readonly contractUuid$ = this.store.select(selectItContractUuid).pipe(filterNullish());
  public readonly validParentContracts$ = this.select((state) => state.validParentContracts).pipe(filterNullish());

  constructor(
    @Inject(OrganizationV2Service) private readonly organizationApiService: OrganizationV2Service,
    @Inject(ItContractV2Service) private readonly apiItContractService: ItContractV2Service,
    private readonly store: Store,
  ) {
    super({ usersIsLoading: false, organizationsIsLoading: false, contractsLoading: false });
  }

  private updateValidParentContracts = this.updater(
    (state, validParentContracts: IdentityNamePair[]): State => ({
      ...state,
      validParentContracts,
    }),
  );

  private updateUsers = this.updater(
    (state, users: APIOrganizationUserResponseDTO[]): State => ({
      ...state,
      users,
    }),
  );

  private updateUsersIsLoading = this.updater(
    (state, isLoading: boolean): State => ({ ...state, usersIsLoading: isLoading }),
  );

  private updateOrganizations = this.updater(
    (state, organizations: APIOrganizationResponseDTO[]): State => ({ ...state, organizations }),
  );

  private updateOrganizationsIsLoading = this.updater(
    (state, isLoading: boolean): State => ({ ...state, organizationsIsLoading: isLoading }),
  );

  private updateContractsLoading = this.updater(
    (state, contractsLoading: boolean): State => ({
      ...state,
      contractsLoading,
    }),
  );

  public searchUsersInOrganization = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([search, organizationUuid]) => {
        this.updateUsersIsLoading(true);
        return this.organizationApiService
          .getManyOrganizationV2GetOrganizationUsers({
            organizationUuid,
            nameOrEmailQuery: search,
          })
          .pipe(
            tapResponse({
              next: (users) => this.updateUsers(users),
              error: (e) => console.error(e),
              complete: () => this.updateUsersIsLoading(false),
            }),
          );
      }),
    ),
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
            tapResponse({
              next: (organizations) => this.updateOrganizations(organizations),
              error: (e) => console.error(e),
              complete: () => this.updateOrganizationsIsLoading(false),
            }),
          );
      }),
    ),
  );

  public searchParentContracts = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.updateContractsLoading(true)),
      combineLatestWith(
        this.store.select(selectOrganizationUuid).pipe(filterNullish()),
        this.store.select(selectItContractUuid).pipe(filterNullish()),
      ),
      mergeMap(([search, organizationUuid, contractUuid]) => {
        return this.apiItContractService
          .getManyItContractV2GetItContracts({ organizationUuid, nameContent: search })
          .pipe(
            tapResponse({
              next: (contracts) => {
                const validContractsTree = removeNodeAndChildren(mapContractsToTree(contracts), contractUuid);
                this.updateValidParentContracts(mapTreeToIdentityNamePairs(validContractsTree));
              },
              error: (e) => console.error(e),
              complete: () => this.updateContractsLoading(false),
            }),
          );
      }),
    ),
  );
}
