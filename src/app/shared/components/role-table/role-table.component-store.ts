import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, map, mergeMap, switchMap, tap } from 'rxjs';
import {
  APIExtendedRoleAssignmentResponseDTO,
  APIOrganizationUserResponseDTO,
  APIV2OrganizationService,
} from 'src/app/api/v2';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { BOUNDED_PAGINATION_QUERY_MAX_SIZE } from '../../constants';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { filterNullish } from '../../pipes/filter-nullish';
import { RoleOptionTypeService } from '../../services/role-option-type.service';

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

  public readonly users$ = this.select((state) => state.users).pipe(filterNullish());
  public readonly usersIsLoading$ = this.select((state) => state.usersLoading).pipe(filterNullish());

  public readonly selectUserResultIsLimited$ = this.users$.pipe(
    filterNullish(),
    map((users) => users.length >= this.PAGE_SIZE)
  );

  constructor(
    private readonly store: Store,
    private readonly apiOrganizationService: APIV2OrganizationService,
    private readonly roleOptionTypeService: RoleOptionTypeService
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

  public getRolesByEntityUuid = this.effect(
    (params$: Observable<{ entityUuid: string; entityType: RoleOptionTypes }>) =>
      params$.pipe(
        mergeMap((params) => {
          this.updateRolesIsLoading(true);
          return this.roleOptionTypeService.getEntityRoles(params.entityUuid, params.entityType).pipe(
            tapResponse(
              (roles) =>
                this.updateRoles(
                  roles.sort((a, b) => a.role.name.localeCompare(b.role.name) || a.user.name.localeCompare(b.user.name))
                ),
              (e) => console.error(e),
              () => this.updateRolesIsLoading(false)
            )
          );
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
