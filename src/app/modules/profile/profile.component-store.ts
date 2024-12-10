import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { combineLatestWith, mergeMap, Observable, tap } from 'rxjs';
import { APIUserResponseDTO, APIV2UsersInternalINTERNALService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectUserOrganizationUuid, selectUserUuid } from 'src/app/store/user-store/selectors';

interface State {
  isLoading: boolean;
  user?: APIUserResponseDTO;
}

@Injectable()
export class ProfileComponentStore extends ComponentStore<State> {
  public readonly isLoading$ = this.select((state) => state.isLoading);
  public readonly user$ = this.select((state) => state.user);

  constructor(
    @Inject(APIV2UsersInternalINTERNALService) private userService: APIV2UsersInternalINTERNALService,
    private store: Store
  ) {
    super({ isLoading: false });
  }

  private readonly setLoading = this.updater((state, isLoading: boolean): State => ({ ...state, isLoading }));
  public readonly setUser = this.updater((state, user: APIUserResponseDTO): State => ({ ...state, user }));

  public getUser = this.effect((_: Observable<void>) =>
    this.store.select(selectUserUuid).pipe(
      filterNullish(),
      tap(() => this.setLoading(true)),
      combineLatestWith(this.store.select(selectUserOrganizationUuid).pipe(filterNullish())),
      mergeMap(([userUuid, organizationUuid]) => {
        return this.userService.getSingleUsersInternalV2GetUserByUuid({ organizationUuid, userUuid }).pipe(
          tapResponse(
            (user) => this.setUser(user as APIUserResponseDTO),
            (e) => console.error(e),
            () => this.setLoading(false)
          )
        );
      })
    )
  );
}
