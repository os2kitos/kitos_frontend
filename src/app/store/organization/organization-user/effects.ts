import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, combineLatestWith, map, of, switchMap } from 'rxjs';
import { APIOrganizationUserResponseDTO, APIV2UsersInternalINTERNALService } from 'src/app/api/v2';
import { ORGANIZATION_USER_COLUMNS_ID } from 'src/app/shared/constants/persistent-state-constants';
import { OData } from 'src/app/shared/models/odata.model';
import { adaptOrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { GridDataCacheService } from 'src/app/shared/services/grid-data-cache.service';
import { selectOrganizationUuid } from '../../user-store/selectors';
import { OrganizationUserActions } from './actions';
import { selectPreviousGridState } from './selectors';

@Injectable()
export class OrganizationUserEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private httpClient: HttpClient,
    @Inject(APIV2UsersInternalINTERNALService) private apiService: APIV2UsersInternalINTERNALService,
    private gridColumnStorageService: GridColumnStorageService,
    private gridDataCacheService: GridDataCacheService
  ) {}

  getOrganizationUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUserActions.getOrganizationUsers),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid), this.store.select(selectPreviousGridState)]),
      switchMap(([{ gridState }, organizationUuid, previousGridState]) => {
        this.gridDataCacheService.tryResetOnGridStateChange(gridState, previousGridState);

        const cachedRange = this.gridDataCacheService.get(gridState);
        if (cachedRange.data !== undefined) {
          return of(OrganizationUserActions.getOrganizationUsersSuccess(cachedRange.data, cachedRange.total));
        }

        const cacheableOdataString = this.gridDataCacheService.toChunkedODataString(gridState, { utcDates: true });
        const fixedOdataString = applyQueryFixes(cacheableOdataString);

        return this.httpClient
          .get<OData>(
            `/odata/GetUsersByUuid(organizationUuid=${organizationUuid})?$expand=ObjectOwner,` +
              `OrganizationRights($filter=Organization/Uuid eq ${organizationUuid}),` +
              `OrganizationUnitRights($filter=Object/Organization/Uuid eq ${organizationUuid};$expand=Object($select=Name,Uuid),Role($select=Name,Uuid,HasWriteAccess)),` +
              `ItSystemRights($expand=Role($select=Name,Uuid,HasWriteAccess),Object($select=ItSystem,Uuid;$expand=ItSystem($select=Name))),` +
              `ItContractRights($expand=Role($select=Name,Uuid,HasWriteAccess),Object($select=Name,Uuid)),` +
              `DataProcessingRegistrationRights($expand=Role($select=Name,Uuid,HasWriteAccess),Object($select=Name,Uuid)),&${fixedOdataString}&$count=true`
          )
          .pipe(
            map((data) => {
              const dataItems = compact(data.value.map(adaptOrganizationUser));
              const total = data['@odata.count'];
              this.gridDataCacheService.set(gridState, dataItems, total);

              const returnData = this.gridDataCacheService.gridStateSliceFromArray(dataItems, gridState);
              return OrganizationUserActions.getOrganizationUsersSuccess(returnData, total);
            }),
            catchError(() => of(OrganizationUserActions.getOrganizationUsersError()))
          );
      })
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUserActions.updateGridState),
      map(({ gridState }) => OrganizationUserActions.getOrganizationUsers(gridState))
    );
  });

  updateGridColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUserActions.updateGridColumns),
      map(({ gridColumns }) => {
        this.gridColumnStorageService.setColumns(ORGANIZATION_USER_COLUMNS_ID, gridColumns);
        return OrganizationUserActions.updateGridColumnsSuccess(gridColumns);
      })
    );
  });

  getUserPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUserActions.getOrganizationUserPermissions),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([_, organizationUuid]) =>
        this.apiService.getSingleUsersInternalV2GetCollectionPermissions({ organizationUuid }).pipe(
          map((permissions) => OrganizationUserActions.getOrganizationUserPermissionsSuccess(permissions)),
          catchError(() => of(OrganizationUserActions.getOrganizationUserPermissionsError()))
        )
      )
    );
  });

  createUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUserActions.createUser),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ request }, organizationUuid]) =>
        this.apiService.postSingleUsersInternalV2CreateUser({ parameters: request, organizationUuid }).pipe(
          map((user) => OrganizationUserActions.createUserSuccess(user as APIOrganizationUserResponseDTO)),
          catchError(() => of(OrganizationUserActions.createUserError()))
        )
      )
    );
  });

  sendNotification$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUserActions.sendNotification),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ userUuid }, organizationUuid]) =>
        this.apiService
          .postSingleUsersInternalV2SendNotification({
            userUuid,
            organizationUuid,
          })
          .pipe(
            map(() => OrganizationUserActions.sendNotificationSuccess(userUuid)),
            catchError(() => of(OrganizationUserActions.sendNotificationError()))
          )
      )
    );
  });

  updateUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUserActions.updateUser),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ userUuid, request }, organizationUuid]) =>
        this.apiService
          .patchSingleUsersInternalV2PatchUser({
            userUuid: userUuid,
            organizationUuid,
            parameters: request,
          })
          .pipe(
            map((user) => OrganizationUserActions.updateUserSuccess(user)),
            catchError(() => of(OrganizationUserActions.updateUserError()))
          )
      )
    );
  });

  deleteUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUserActions.deleteUser),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ userUuid }, organizationUuid]) =>
        this.apiService
          .deleteSingleUsersInternalV2DeleteUserInOrganization({
            userUuid,
            organizationUuid,
          })
          .pipe(
            map(() => OrganizationUserActions.deleteUserSuccess(userUuid)),
            catchError(() => of(OrganizationUserActions.deleteUserError()))
          )
      )
    );
  });

  copyRoles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUserActions.copyRoles),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ fromUserUuid, toUserUuid, request }, organizationUuid]) =>
        this.apiService
          .postSingleUsersInternalV2CopyRoles({
            fromUserUuid,
            toUserUuid,
            organizationUuid,
            request,
          })
          .pipe(
            map(() => OrganizationUserActions.copyRolesSuccess()),
            catchError(() => of(OrganizationUserActions.copyRolesError()))
          )
      )
    );
  });

  transferRoles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUserActions.transferRoles),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ fromUserUuid, toUserUuid, request }, organizationUuid]) =>
        this.apiService
          .postSingleUsersInternalV2TransferRoles({
            fromUserUuid,
            toUserUuid,
            organizationUuid,
            request,
          })
          .pipe(
            map(() => OrganizationUserActions.transferRolesSuccess()),
            catchError(() => of(OrganizationUserActions.transferRolesError()))
          )
      )
    );
  });

  verifyUserEmail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUserActions.verifyUserEmail),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ email }, organizationUuid]) =>
        this.apiService
          .getSingleUsersInternalV2GetUsersByEmailInOtherOrganizations({
            organizationUuid,
            email,
          })
          .pipe(
            map((response) => {
              if (response) {
                return OrganizationUserActions.verifyUserEmailError();
              } else {
                return OrganizationUserActions.verifyUserEmailSuccess(email);
              }
            }),

            catchError(() => of(OrganizationUserActions.verifyUserEmailError()))
          )
      )
    );
  });
}

function applyQueryFixes(odataString: string) {
  const objectOwnerColumn = 'ObjectOwner.Name';
  const nameColumn = 'Name';

  return odataString
    .replace(getNameFilterPattern(objectOwnerColumn), `$1concat(concat(ObjectOwner/Name, ' '), ObjectOwner/LastName)$2`)
    .replace(getNameFilterPattern(nameColumn), `$1concat(concat(Name, ' '), LastName)$2`);
}

function getNameFilterPattern(column: string) {
  return new RegExp(`(\\w+\\()${column}(.*?\\))`, 'i');
}
