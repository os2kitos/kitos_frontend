import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { combineLatestWith, finalize, map, Observable, switchMap, tap } from 'rxjs';
import { APIV2OrganizationService } from 'src/app/api/v2';
import { IdentityNamePair } from 'src/app/shared/models/identity-name-pair.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { adaptMasterDataOrganizationUser, MasterDataOrganizationUser } from './organization-master-data-user.model';

interface State {
  organizationUsers: MasterDataOrganizationUser[];
  organizationUsersLoading: boolean;
}

@Injectable()
export class OrganizationMasterDataComponentStore extends ComponentStore<State> implements OnDestroy {
  public readonly organizationUsersLoading$ = this.select((state) => state.organizationUsersLoading);
  public readonly organizationUsers$ = this.select((state) => state.organizationUsers);
  public readonly organizationUserIdentityNamePairs$ = this.organizationUsers$.pipe(
    map((users) => users.map((user) => this.toIdentityNamePair(user)))
  );

  constructor(
    @Inject(APIV2OrganizationService)
    private organizationService: APIV2OrganizationService,
    private store: Store
  ) {
    super({ organizationUsers: [], organizationUsersLoading: false });
  }

  private readonly setLoading = this.updater(
    (state, organizationUsersLoading: boolean): State => ({ ...state, organizationUsersLoading })
  );

  private readonly setOrganizationUsers = this.updater(
    (state, organizationUsers: MasterDataOrganizationUser[]): State => ({ ...state, organizationUsers })
  );

  public getOrganizationUsers$ = this.effect((email$: Observable<string>) =>
    email$.pipe(
      tap(() => this.setLoading(true)),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([email, organizationUuid]) =>
        this.organizationService
          .getManyOrganizationV2GetOrganizationUsers({
            organizationUuid: organizationUuid,
            nameOrEmailQuery: email,
          })
          .pipe(
            tapResponse(
              (responseDtos) => {
                const organizationUsers = responseDtos
                  .map((userDto) => adaptMasterDataOrganizationUser(userDto))
                  .filter((u) => u !== undefined);
                this.setOrganizationUsers(organizationUsers);
              },
              () => OrganizationUserActions.getOrganizationUsersError()
            ),
            finalize(() => this.setLoading(false))
          )
      )
    )
  );

  public searchOrganizationUsers = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.setLoading(true)),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([search, organizationUuid]) => {
        return this.organizationService
          .getManyOrganizationV2GetOrganizationUsers({
            organizationUuid,
            emailQuery: search,
          })
          .pipe(
            tapResponse(
              (responseDtos) => {
                const organizationUsers = responseDtos
                  .map((userDto) => adaptMasterDataOrganizationUser(userDto))
                  .filter((u) => u !== undefined);
                this.setOrganizationUsers(organizationUsers);
              },
              () => OrganizationUserActions.getOrganizationUsersError()
            ),
            finalize(() => this.setLoading(false))
          );
      })
    )
  );

  private toIdentityNamePair = (source: MasterDataOrganizationUser): IdentityNamePair => {
    const uuid = source?.uuid ? source.uuid : '';
    const name = source?.email ? source.email : '';
    return { uuid: uuid, name: name };
  };
}
