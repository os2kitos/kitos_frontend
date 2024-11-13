import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { mergeMap, Observable, tap } from 'rxjs';
import {
  APIOrganizationResponseDTO,
  APIUserReferenceResponseDTO,
  APIV2GlobalUserInternalINTERNALService,
} from 'src/app/api/v2';
import { NotificationService } from 'src/app/shared/services/notification.service';

interface State {
  isLoading: boolean;
  users: APIUserReferenceResponseDTO[];
  userOrganizations?: APIOrganizationResponseDTO[];
}

@Injectable()
export class GlobalAdminOtherUserShutdownComponentStore extends ComponentStore<State> {
  public readonly isLoading$ = this.select((state) => state.isLoading);
  public readonly users$ = this.select((state) => state.users);
  public readonly userOrganizations$ = this.select((state) => state.userOrganizations);

  constructor(
    @Inject(APIV2GlobalUserInternalINTERNALService) private userService: APIV2GlobalUserInternalINTERNALService,
    private notificationService: NotificationService
  ) {
    super({ isLoading: false, users: [] });
  }

  private readonly setLoading = this.updater((state, isLoading: boolean): State => ({ ...state, isLoading }));
  private readonly setUsers = this.updater(
    (state, users: APIUserReferenceResponseDTO[] | undefined): State => ({
      ...state,
      users: users ?? [],
    })
  );
  private readonly setUserOrganizations = this.updater(
    (state, userOrganizations: APIOrganizationResponseDTO[] | undefined): State => ({
      ...state,
      userOrganizations: userOrganizations,
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
              (users) => this.setUsers(users),
              (e) => console.error(e),
              () => this.setLoading(false)
            )
          );
      })
    )
  );

  public getUserOrganizations = this.effect((userUuid$: Observable<string>) =>
    userUuid$.pipe(
      mergeMap((userUuid) => {
        return this.userService.getManyGlobalUserInternalV2GetOrganizationsByUserUuid({ userUuid }).pipe(
          tapResponse(
            (userOrganizations) => {
              this.setUserOrganizations(userOrganizations);
            },
            (e) => console.error(e)
          )
        );
      })
    )
  );

  public deleteUser = this.effect((userUuid$: Observable<string>) =>
    userUuid$.pipe(
      mergeMap((userUuid) => {
        return this.userService.deleteSingleGlobalUserInternalV2DeleteUser({ userUuid }).pipe(
          tapResponse(
            () => {
              this.notificationService.showDefault($localize`Brugeren blev slettet`);
            },
            (e) => {
              console.error(e);
              this.notificationService.showError($localize`Kunne ikke slette brugeren`);
            }
          )
        );
      })
    )
  );

  public resetUserOrganizations() {
    this.setUserOrganizations(undefined);
  }
}
