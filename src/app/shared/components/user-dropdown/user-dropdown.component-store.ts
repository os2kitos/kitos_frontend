import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { mergeMap, Observable, tap } from 'rxjs';
import { APIUserReferenceResponseDTO, APIV2GlobalUserInternalINTERNALService } from 'src/app/api/v2';

interface State {
  users: APIUserReferenceResponseDTO[];
  loading: boolean;
}

@Injectable()
export class UserDropdownComponentStore extends ComponentStore<State> {
  public readonly users$ = this.select((state) => state.users);
  public readonly loading$ = this.select((state) => state.loading);

  constructor(private userService: APIV2GlobalUserInternalINTERNALService) {
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
            tapResponse(
              (filteredUsers) => this.setUsers(filteredUsers),
              (error) => console.error(error),
              () => this.setLoading(false)
            )
          );
      })
    )
  );
}
