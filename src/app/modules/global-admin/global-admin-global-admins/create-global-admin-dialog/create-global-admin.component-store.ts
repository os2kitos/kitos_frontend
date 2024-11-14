import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { map, mergeMap, Observable, tap, withLatestFrom } from 'rxjs';
import { APIUserReferenceResponseDTO, APIV2GlobalUserInternalINTERNALService } from 'src/app/api/v2';
import { GlobalAdminUser } from 'src/app/shared/models/global-admin/global-admin-user.model';
import { selectAllGlobalAdmins } from 'src/app/store/global-admin/selectors';

interface State {
  users: APIUserReferenceResponseDTO[];
  loading: boolean;
}

@Injectable()
export class CreateGlobalAdminComponentStore extends ComponentStore<State> {
  public readonly users$ = this.select((state) => state.users);
  public readonly loading$ = this.select((state) => state.loading);

  private readonly globalAdmins$ = this.store.select(selectAllGlobalAdmins);

  constructor(private userService: APIV2GlobalUserInternalINTERNALService, private store: Store) {
    super({ users: [], loading: false });
  }

  private setUsers = this.updater(
    (state, users: APIUserReferenceResponseDTO[]): State => ({
      ...state,
      users,
    })
  );

  private setLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    })
  );

  public searchUsers = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.setLoading(true)),
      mergeMap((search) => {
        return this.userService
          .getManyGlobalUserInternalV2GetUsers({
            nameOrEmailQuery: search,
          })
          .pipe(
            withLatestFrom(this.globalAdmins$),
            map(([users, globalAdmins]) => this.getNonGlobalAdminUsers(users, globalAdmins)),
            tapResponse(
              (filteredUsers) => this.setUsers(filteredUsers),
              (error) => console.error(error),
              () => this.setLoading(false)
            )
          );
      })
    )
  );

  private getNonGlobalAdminUsers(
    users: APIUserReferenceResponseDTO[],
    globalAdmins: GlobalAdminUser[]
  ): APIUserReferenceResponseDTO[] {
    const globalAdminUUIDs = new Set(globalAdmins.map((admin) => admin.uuid));
    const filteredUsers = users.filter((user) => !globalAdminUUIDs.has(user.uuid));
    return filteredUsers;
  }
}
