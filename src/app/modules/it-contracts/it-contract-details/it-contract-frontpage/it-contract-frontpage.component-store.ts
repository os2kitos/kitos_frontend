import { Injectable, OnDestroy } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { Observable, combineLatestWith, mergeMap, switchMap } from 'rxjs';
import { APIOrganizationResponseDTO, APIOrganizationUserResponseDTO, APIV2OrganizationService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  users?: APIOrganizationUserResponseDTO[];
  usersIsLoading: boolean;
  organizations?: APIOrganizationResponseDTO[];
  organizationsIsLoading: boolean;
}

@Injectable()
export class ItContractFrontpageComponentStore extends ComponentStore<State> implements OnDestroy {
  public readonly users$ = this.select((state) => state.users).pipe(filterNullish());
  public readonly usersIsLoading$ = this.select((state) => state.usersIsLoading);
  public readonly organizations$ = this.select((state) => state.organizations).pipe(filterNullish());
  public readonly organizationsIsLoading$ = this.select((state) => state.organizationsIsLoading);

  constructor(private readonly organizationApiService: APIV2OrganizationService, private readonly store: Store) {
    super({ usersIsLoading: false, organizationsIsLoading: false });
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
}
