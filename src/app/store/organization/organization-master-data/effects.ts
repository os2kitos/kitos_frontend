import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, combineLatestWith, map, of, switchMap } from 'rxjs';
import { APIV2OrganizationsInternalINTERNALService } from 'src/app/api/v2';
import { adaptOrganizationMasterDataRoles } from 'src/app/shared/models/organization/organization-master-data/organization-master-data-roles.model';
import { adaptOrganizationMasterData } from 'src/app/shared/models/organization/organization-master-data/organization-master-data.model';
import { adaptOrganizationPermissions } from 'src/app/shared/models/organization/organization-permissions.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from '../../user-store/selectors';
import { OrganizationMasterDataActions } from './actions';

@Injectable()
export class OrganizationMasterDataEffects {
  constructor(
    @Inject(APIV2OrganizationsInternalINTERNALService)
    private organizationInternalService: APIV2OrganizationsInternalINTERNALService,
    private actions$: Actions,
    private store: Store
  ) {}

  getOrganizationMasterData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationMasterDataActions.getMasterData),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([, organizationUuid]) =>
        this.organizationInternalService
          .getSingleOrganizationsInternalV2GetOrganizationMasterData({ organizationUuid })
          .pipe(
            map((organizationMasterDataDto) => {
              const organizationMasterData = adaptOrganizationMasterData(organizationMasterDataDto);
              if (organizationMasterData)
                return OrganizationMasterDataActions.getMasterDataSuccess(organizationMasterData);
              else return OrganizationMasterDataActions.getMasterDataError();
            }),
            catchError(() => of(OrganizationMasterDataActions.getMasterDataError()))
          )
      )
    );
  });

  patchOrganizationMasterData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationMasterDataActions.patchMasterData),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ request }, organizationUuid]) =>
        this.organizationInternalService
          .patchSingleOrganizationsInternalV2UpdateOrganizationMasterData({ organizationUuid, requestDto: request })
          .pipe(
            map((organizationMasterDataDto) => {
              const organizationMasterData = adaptOrganizationMasterData(organizationMasterDataDto);
              return organizationMasterData
                ? OrganizationMasterDataActions.patchMasterDataSuccess(organizationMasterData)
                : OrganizationMasterDataActions.getMasterDataError();
            }),
            catchError(() => of(OrganizationMasterDataActions.patchMasterDataError()))
          )
      )
    );
  });

  getOrganizationMasterDataRoles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationMasterDataActions.getMasterDataRoles),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([, organizationUuid]) =>
        this.organizationInternalService
          .getSingleOrganizationsInternalV2GetOrganizationMasterDataRoles({ organizationUuid })
          .pipe(
            map((organizationMasterDataRolesDto) => {
              const organizationMasterDataRoles = adaptOrganizationMasterDataRoles(organizationMasterDataRolesDto);
              return organizationMasterDataRoles
                ? OrganizationMasterDataActions.getMasterDataRolesSuccess(organizationMasterDataRoles)
                : OrganizationMasterDataActions.getMasterDataRolesError();
            }),
            catchError(() => of(OrganizationMasterDataActions.getMasterDataRolesError()))
          )
      )
    );
  });

  patchOrganizationMasterDataRoles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationMasterDataActions.patchMasterDataRoles),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ request }, organizationUuid]) =>
        this.organizationInternalService
          .patchSingleOrganizationsInternalV2UpsertOrganizationMasterDataRoles({
            organizationUuid,
            requestDto: request,
          })
          .pipe(
            map((organizationMasterDataRolesDto) => {
              const organizationMasterDataRoles = adaptOrganizationMasterDataRoles(organizationMasterDataRolesDto);
              return organizationMasterDataRoles
                ? OrganizationMasterDataActions.patchMasterDataRolesSuccess(organizationMasterDataRoles)
                : OrganizationMasterDataActions.patchMasterDataRolesError();
            }),
            catchError(() => of(OrganizationMasterDataActions.patchMasterDataRolesError()))
          )
      )
    );
  });

  getOrganizationPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationMasterDataActions.getOrganizationPermissions),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([, organizationUuid]) =>
        this.organizationInternalService
          //todo update method
          .getSingleOrganizationsInternalV2GetOrganizationMasterData({ organizationUuid })
          .pipe(
            map((permissionsDto) => {
              const permissions = adaptOrganizationPermissions(permissionsDto);
              if (permissions) return OrganizationMasterDataActions.getOrganizationPermissionsSuccess(permissions);
              else return OrganizationMasterDataActions.getOrganizationPermissionsError();
            }),
            catchError(() => of(OrganizationMasterDataActions.getOrganizationPermissionsError()))
          )
      )
    );
  });
}
