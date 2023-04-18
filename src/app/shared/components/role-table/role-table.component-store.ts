import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, mergeMap, switchMap, tap } from 'rxjs';
import {
  APIExtendedRoleAssignmentResponseDTO,
  APIOrganizationUserResponseDTO,
  APIV2ItSystemUsageInternalINTERNALService,
  APIV2OrganizationService,
} from 'src/app/api/v2';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { BOUNDED_PAGINATION_QUERY_MAX_SIZE } from '../../constants';
import { filterNullish } from '../../pipes/filter-nullish';

interface State {
  rolesLoading: boolean;
  roles?: Array<APIExtendedRoleAssignmentResponseDTO>;
  usersLoading: boolean;
  users?: Array<APIOrganizationUserResponseDTO>;
}

@Injectable()
export class RoleTableComponentStore extends ComponentStore<State> {
  public readonly PAGE_SIZE = BOUNDED_PAGINATION_QUERY_MAX_SIZE;

  public readonly roles$ = this.select((state) => state.roles).pipe(filterNullish());
  public readonly rolesIsLoading$ = this.select((state) => state.rolesLoading).pipe(filterNullish());

  public readonly users$ = this.select((state) => state.users);
  public readonly usersIsLoading$ = this.select((state) => state.usersLoading);

  constructor(
    private readonly store: Store,
    private readonly apiUsageService: APIV2ItSystemUsageInternalINTERNALService,
    private readonly apiOrganizationService: APIV2OrganizationService
  ) {
    super({ rolesLoading: false, usersLoading: false });
  }

  private updateRoles = this.updater(
    (state, roles: Array<APIExtendedRoleAssignmentResponseDTO>): State => ({
      ...state,
      roles,
    })
  );

  private updateRolesIsLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      rolesLoading: loading,
    })
  );

  private updateUsers = this.updater(
    (state, users: Array<APIOrganizationUserResponseDTO>): State => ({
      ...state,
      users,
    })
  );

  private updateUsersIsLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      usersLoading: loading,
    })
  );

  public getRolesByEntityUuid = this.effect((params$: Observable<{ entityUuid: string; optionType: string }>) =>
    params$.pipe(
      mergeMap((params) => {
        this.updateRolesIsLoading(true);
        if (!params.optionType) {
          this.updateRolesIsLoading(false);
          console.error('Option Type is not set');
          return [];
        }
        switch (params.optionType) {
          case 'it-system-usage':
            return this.apiUsageService
              .getManyItSystemUsageInternalV2GetAddRoleAssignments({
                systemUsageUuid: params.entityUuid,
              })
              .pipe(
                tapResponse(
                  (roles) => this.updateRoles(roles),
                  (e) => console.error(e),
                  () => this.updateRolesIsLoading(false)
                )
              );
          default:
            return [];
        }
      })
    )
  );

  public getUsers = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.updateUsersIsLoading(true)),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([search, organziationUuid]) =>
        this.apiOrganizationService
          .getManyOrganizationV2GetOrganizationUsers({
            organizationUuid: organziationUuid,
            nameOrEmailQuery: search,
            pageSize: this.PAGE_SIZE,
          })
          .pipe(
            tapResponse(
              (users) => this.updateUsers(users),
              (error) => console.error(error),
              () => this.updateUsersIsLoading(false)
            )
          )
      )
    )
  );
}
