import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { combineLatestWith, mergeMap, Observable, tap } from 'rxjs';
import { APIUserResponseDTO, APIV2UsersInternalINTERNALService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  isLoading: boolean;
  alreadyExists: boolean;
  noUserInOtherOrgs: boolean;
}

@Injectable()
export class CreateUserDialogComponentStore extends ComponentStore<State> {
  public readonly isLoading$ = this.select((state) => state.isLoading);
  public readonly alreadyExists$ = this.select((state) => state.alreadyExists);
  public readonly noUserInOtherOrgs$ = this.select((state) => state.noUserInOtherOrgs);

  constructor(
    @Inject(APIV2UsersInternalINTERNALService) private userService: APIV2UsersInternalINTERNALService,
    private store: Store
  ) {
    super({ isLoading: false, alreadyExists: false, noUserInOtherOrgs: true });
  }

  private readonly setLoading = this.updater((state, isLoading: boolean): State => ({ ...state, isLoading }));
  private readonly setUser = this.updater(
    (state, user: APIUserResponseDTO | undefined): State => ({
      ...state,
      alreadyExists: user !== undefined,
      noUserInOtherOrgs: user ? false : true,
    })
  );

  public getUserWithEmail = this.effect((email$: Observable<string>) =>
    email$.pipe(
      tap(() => this.setLoading(true)),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([email, organizationUuid]) => {
        return this.userService
          .getSingleUsersInternalV2GetUsersByEmailInOtherOrganizations({
            organizationUuid: organizationUuid,
            email: email,
          })
          .pipe(
            tapResponse(
              (user) => this.setUser(user),
              (e) => console.error(e),
              () => this.setLoading(false)
            )
          );
      })
    )
  );
}
