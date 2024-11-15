import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { mergeMap, tap } from 'rxjs';
import {
  APIUserWithCrossOrganizationalRightsResponseDTO,
  APIUserWithOrganizationResponseDTO,
  APIV2GlobalUserInternalINTERNALService,
} from 'src/app/api/v2';
import { NotificationService } from 'src/app/shared/services/notification.service';

interface State {
  isLoadingUsersWithRightsholderAccess: boolean;
  isLoadingUsersWithCrossAccess: boolean;
  usersWithRightsholderAccess?: APIUserWithOrganizationResponseDTO[];
  usersWithCrossOrganizationalAccess?: APIUserWithCrossOrganizationalRightsResponseDTO[];
}

@Injectable()
export class GlobalAdminOtherApiUsersComponentStore extends ComponentStore<State> {
  public readonly isLoadingUsersWithRightsholderAccess$ = this.select(
    (state) => state.isLoadingUsersWithRightsholderAccess
  );
  public readonly isLoadingUsersWithCrossAccess$ = this.select((state) => state.isLoadingUsersWithCrossAccess);
  public readonly usersWithRightsholderAccess$ = this.select((state) => state.usersWithRightsholderAccess);
  public readonly usersWithCrossOrganizationalAccess$ = this.select(
    (state) => state.usersWithCrossOrganizationalAccess
  );

  constructor(
    @Inject(APIV2GlobalUserInternalINTERNALService) private userService: APIV2GlobalUserInternalINTERNALService,
    private notificationService: NotificationService
  ) {
    super({ isLoadingUsersWithRightsholderAccess: false, isLoadingUsersWithCrossAccess: false });
  }

  private readonly setLoadingUsersWithRightsholderAccess = this.updater(
    (state, isLoadingUsersWithRightsholderAccess: boolean): State => ({
      ...state,
      isLoadingUsersWithRightsholderAccess,
    })
  );
  private readonly setLoadingUsersWithCrossAccess = this.updater(
    (state, isLoadingUsersWithCrossAccess: boolean): State => ({
      ...state,
      isLoadingUsersWithCrossAccess,
    })
  );
  private readonly setUsersWithRightsholderAccess = this.updater(
    (state, usersWithRightsholderAccess: APIUserWithOrganizationResponseDTO[] | undefined): State => ({
      ...state,
      usersWithRightsholderAccess: usersWithRightsholderAccess,
    })
  );
  private readonly setUsersWithCrossAccess = this.updater(
    (
      state,
      usersWithCrossOrganizationalAccess: APIUserWithCrossOrganizationalRightsResponseDTO[] | undefined
    ): State => ({
      ...state,
      usersWithCrossOrganizationalAccess: usersWithCrossOrganizationalAccess,
    })
  );

  public getUsersWithRightsholderAccess = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.setLoadingUsersWithRightsholderAccess(true)),
      mergeMap(() => {
        return this.userService.getManyGlobalUserInternalV2GetUsersWithRightsholderAccess().pipe(
          tapResponse(
            (users) => {
              this.setUsersWithRightsholderAccess(users);
            },
            (e) => console.error(e),
            () => this.setLoadingUsersWithRightsholderAccess(false)
          )
        );
      })
    )
  );

  public getUsersWithCrossAccess = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.setLoadingUsersWithCrossAccess(true)),
      mergeMap(() => {
        return this.userService.getManyGlobalUserInternalV2GetUsersWithCrossAccess().pipe(
          tapResponse(
            (users) => this.setUsersWithCrossAccess(users),
            (e) => console.error(e),
            () => this.setLoadingUsersWithCrossAccess(false)
          )
        );
      })
    )
  );
}
