import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { toODataString } from '@progress/kendo-data-query';
import { compact } from 'lodash';
import { catchError, combineLatestWith, map, of, switchMap } from 'rxjs';
import { APIOrganizationUserResponseDTO, APIV2UsersInternalINTERNALService } from 'src/app/api/v2';
import { OData } from 'src/app/shared/models/odata.model';
import { adaptOrganizationUser } from 'src/app/shared/models/organization-user/organization-user.model';
import { ORGANIZATION_USER_COLUMNS_ID } from 'src/app/shared/persistent-state-constants';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
import { selectOrganizationUuid } from '../user-store/selectors';
import { OrganizationUserActions } from './actions';

@Injectable()
export class OrganizationUserEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private httpClient: HttpClient,
    @Inject(APIV2UsersInternalINTERNALService) private apiService: APIV2UsersInternalINTERNALService,
    private statePersistingService: StatePersistingService
  ) {}

  getItInterfaces$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUserActions.getOrganizationUsers),
      combineLatestWith(this.store.select(selectOrganizationUuid)),
      switchMap(([{ odataString }, organizationUuid]) => {
        const fixedOdataString = applyQueryFixes(odataString);

        return this.httpClient
          .get<OData>(
            `/odata/GetUsersByUuid(organizationUuid=${organizationUuid})?$expand=ObjectOwner,OrganizationUnitRights($filter=Object/Organization/Uuid eq ${organizationUuid}; $expand=Role($select=Name)),OrganizationRights($filter=Organization/Uuid eq ${organizationUuid})&${fixedOdataString}&$count=true`
          )
          .pipe(
            map((data) =>
              OrganizationUserActions.getOrganizationUsersSuccess(
                compact(data.value.map(adaptOrganizationUser)),
                data['@odata.count']
              )
            ),
            catchError(() => of(OrganizationUserActions.getOrganizationUsersError()))
          );
      })
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUserActions.updateGridState),
      map(({ gridState }) => OrganizationUserActions.getOrganizationUsers(toODataString(gridState)))
    );
  });

  updateGridColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUserActions.updateGridColumns),
      map(({ gridColumns }) => {
        this.statePersistingService.set(ORGANIZATION_USER_COLUMNS_ID, gridColumns);
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
        this.apiService.postSingleUsersInternalV2CreateUnit({ parameters: request, organizationUuid }).pipe(
          map((user) => OrganizationUserActions.createUserSuccess(user as APIOrganizationUserResponseDTO)),
          catchError(() => of(OrganizationUserActions.createUserError()))
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
