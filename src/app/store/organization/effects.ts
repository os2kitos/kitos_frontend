import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, combineLatestWith, map, of, switchMap } from 'rxjs';
import { APIV2OrganizationsInternalINTERNALService } from 'src/app/api/v2';
import { adaptOrganizationMasterDataRoles } from 'src/app/shared/models/organization/organization-master-data/organization-master-data-roles.model';
import { adaptOrganizationMasterData } from 'src/app/shared/models/organization/organization-master-data/organization-master-data.model';
import { adaptOrganizationPermissions } from 'src/app/shared/models/organization/organization-permissions.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from '../user-store/selectors';
import { OrganizationActions } from './actions';
import { HttpClient } from '@angular/common/http';
import { adaptOrganization } from 'src/app/shared/models/organization/organization.model';
import { OData } from 'src/app/shared/models/odata.model';
import { compact } from 'lodash';
import { toODataString } from '@progress/kendo-data-query';
import { mapUIRootConfig } from 'src/app/shared/models/ui-config/ui-root-config.model';

@Injectable()
export class OrganizationEffects {
  constructor(
    @Inject(APIV2OrganizationsInternalINTERNALService)
    private organizationInternalService: APIV2OrganizationsInternalINTERNALService,
    private actions$: Actions,
    private store: Store,
    private httpClient: HttpClient
  ) {}

  getOrganizations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.getOrganizations),
      switchMap(({ odataString }) => {
        const fixedOdataString = applyQueryFixes(odataString);

        return this.httpClient.get<OData>(`/odata/Organizations?${fixedOdataString}&$count=true`).pipe(
          map((data) =>
            OrganizationActions.getOrganizationsSuccess(
              compact(data.value.map(adaptOrganization)),
              data['@odata.count']
            )
          ),
          catchError(() => of(OrganizationActions.getOrganizationsError()))
        );
      })
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.updateGridState),
      map(({ gridState }) => {
        return OrganizationActions.getOrganizations(toODataString(gridState));
      })
    );
  });

  getOrganizationMasterData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.getMasterData),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([, organizationUuid]) =>
        this.organizationInternalService
          .getSingleOrganizationsInternalV2GetOrganizationMasterData({ organizationUuid })
          .pipe(
            map((organizationMasterDataDto) => {
              const organizationMasterData = adaptOrganizationMasterData(organizationMasterDataDto);
              if (organizationMasterData) return OrganizationActions.getMasterDataSuccess(organizationMasterData);
              else return OrganizationActions.getMasterDataError();
            }),
            catchError(() => of(OrganizationActions.getMasterDataError()))
          )
      )
    );
  });

  patchOrganizationMasterData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.patchMasterData),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ request }, organizationUuid]) =>
        this.organizationInternalService
          .patchSingleOrganizationsInternalV2UpsertOrganizationMasterDataRoles({ organizationUuid, requestDto: request })
          .pipe(
            map((organizationMasterDataDto) => {
              const organizationMasterData = adaptOrganizationMasterData(organizationMasterDataDto);
              return organizationMasterData
                ? OrganizationActions.patchMasterDataSuccess(organizationMasterData)
                : OrganizationActions.patchMasterDataError();
            }),
            catchError(() => of(OrganizationActions.patchMasterDataError()))
          )
      )
    );
  });

  getOrganizationMasterDataRoles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.getMasterDataRoles),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([, organizationUuid]) =>
        this.organizationInternalService
          .getSingleOrganizationsInternalV2GetOrganizationMasterDataRoles({ organizationUuid })
          .pipe(
            map((organizationMasterDataRolesDto) => {
              const organizationMasterDataRoles = adaptOrganizationMasterDataRoles(organizationMasterDataRolesDto);
              return organizationMasterDataRoles
                ? OrganizationActions.getMasterDataRolesSuccess(organizationMasterDataRoles)
                : OrganizationActions.getMasterDataRolesError();
            }),
            catchError(() => of(OrganizationActions.getMasterDataRolesError()))
          )
      )
    );
  });

  patchOrganizationMasterDataRoles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.patchMasterDataRoles),
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
                ? OrganizationActions.patchMasterDataRolesSuccess(organizationMasterDataRoles)
                : OrganizationActions.patchMasterDataRolesError();
            }),
            catchError(() => of(OrganizationActions.patchMasterDataRolesError()))
          )
      )
    );
  });

  getOrganizationPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.getOrganizationPermissions),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([, organizationUuid]) =>
        this.organizationInternalService.getSingleOrganizationsInternalV2GetPermissions({ organizationUuid }).pipe(
          map((permissionsDto) => {
            const permissions = adaptOrganizationPermissions(permissionsDto);
            if (permissions) return OrganizationActions.getOrganizationPermissionsSuccess(permissions);
            else return OrganizationActions.getOrganizationPermissionsError();
          }),
          catchError(() => of(OrganizationActions.getOrganizationPermissionsError()))
        )
      )
    );
  });

  getUIRootConfig$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.getUIRootConfig),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([, organizationUuid]) =>
        this.organizationInternalService
          .getSingleOrganizationsInternalV2GetUIRootConfig({ organizationUuid })
          .pipe(
            map((responseDto) => {
              const uiRootConfig = mapUIRootConfig(responseDto);
              return OrganizationActions.getUIRootConfigSuccess({ uiRootConfig });
            }),
            catchError(() => of(OrganizationActions.getUIRootConfigError()))
          )
      )
    );
  });

  patchUIRootConfig$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.patchUIRootConfig),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ dto }, organizationUuid]) =>
        this.organizationInternalService
          .patchSingleOrganizationsInternalV2PatchUIRootConfig({ dto, organizationUuid })
          .pipe(
            map((responseDto) => {
              const uiRootConfig = mapUIRootConfig(responseDto);
              return OrganizationActions.patchUIRootConfigSuccess({ uiRootConfig });
            }),
            catchError(() => of(OrganizationActions.patchUIRootConfigError()))
          )
      )
    );
  });
}

function applyQueryFixes(odataString: string) {
  return odataString.replaceAll('ForeignBusiness', 'ForeignCvr').replaceAll('OrganizationType', 'TypeId');
}
