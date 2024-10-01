import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, combineLatestWith, map, of, switchMap } from 'rxjs';
import { APIV2OrganizationsInternalINTERNALService } from 'src/app/api/v2';
import { adaptOrganizationMasterData } from 'src/app/shared/models/organization/organization-master-data/organizationMasterData.model';
import { adaptOrganizationMasterDataRoles } from 'src/app/shared/models/organization/organization-master-data/organizationMasterDataRoles.model';
import { OrganizationMasterDataActions } from './actions';
import { Store } from '@ngrx/store';
import { selectOrganizationUuid } from '../../user-store/selectors';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';

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
      switchMap(({ organizationUuid, request }) =>
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
      switchMap(([, organizationUuid ]) =>
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
      switchMap(({ organizationUuid, request }) =>
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
}
