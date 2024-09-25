import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { combineLatestWith, mergeMap, Observable, tap } from 'rxjs';
import { APIV2OrganizationService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  isLoading: boolean;
  alreadyExists: boolean;
}

@Injectable()
export class CreateUserDialogComponentStore extends ComponentStore<State> {
  public readonly isLoading$ = this.select((state) => state.isLoading);
  public readonly alreadyExists$ = this.select((state) => state.alreadyExists);

  constructor(
    @Inject(APIV2OrganizationService)
    private organizationService: APIV2OrganizationService,
    private store: Store
  ) {
    super({ isLoading: false, alreadyExists: false });
  }

  private readonly setLoading = this.updater((state, isLoading: boolean): State => ({ ...state, isLoading }));
  private readonly setAlreadyExists = this.updater(
    (state, length: number): State => ({ ...state, alreadyExists: length > 0 })
  );

  public checkEmailAvailability = this.effect((email$: Observable<string>) =>
    email$.pipe(
      tap(() => this.setLoading(true)),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([email, organizationUuid]) => {
        return this.organizationService
          .getManyOrganizationV2GetOrganizationUsers({ organizationUuid: organizationUuid, nameOrEmailQuery: email })
          .pipe(
            tapResponse(
              (users) => this.setAlreadyExists(users.length),
              (e) => console.error(e),
              () => this.setLoading(false)
            )
          );
      })
    )
  );
}
