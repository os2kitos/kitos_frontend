import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { combineLatestWith, finalize, map, Observable, switchMap, tap } from 'rxjs';
import { APIV2OrganizationService, GetManyOrganizationV2GetOrganizationUsersRequestParams } from 'src/app/api/v2';
import { IdentityNamePair } from 'src/app/shared/models/identity-name-pair.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { adaptOrganizationUserV2, OrganizationUserV2 } from '../../../shared/models/organization/organization-user/organization-user-v2.model';

interface State {
  organizationUsers: OrganizationUserV2[];
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
    (state, organizationUsers: OrganizationUserV2[]): State => ({ ...state, organizationUsers })
  );

  public searchOrganizationUsers = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.setLoading(true)),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([search, organizationUuid]) => {
        const request: GetManyOrganizationV2GetOrganizationUsersRequestParams = { organizationUuid };
        if (search) request.emailQuery = search;
        return this.organizationService.getManyOrganizationV2GetOrganizationUsers(request).pipe(
          tapResponse(
            (responseDtos) => {
              const organizationUsers = responseDtos
                .map((userDto) => adaptOrganizationUserV2(userDto))
                .filter((u) => u !== undefined);
              this.setOrganizationUsers(organizationUsers);
            },
            (e) => console.error(e)
          ),
          finalize(() => this.setLoading(false))
        );
      })
    )
  );

  private toIdentityNamePair = (source: OrganizationUserV2): IdentityNamePair => {
    const uuid = source?.uuid ? source.uuid : '';
    const name = source?.email ? source.email : '';
    return { uuid: uuid, name: name };
  };
}
