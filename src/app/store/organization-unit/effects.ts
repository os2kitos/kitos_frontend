import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { concatLatestFrom } from '@ngrx/operators';

import { Store } from '@ngrx/store';
import { catchError, combineLatestWith, filter, map, of, switchMap } from 'rxjs';

import {
  APIOrganizationRegistrationUnitResponseDTO,
  APIV2OrganizationService,
  APIV2OrganizationUnitRegistrationInternalINTERNALService,
  APIV2OrganizationUnitsInternalINTERNALService,
} from 'src/app/api/v2';
import { BOUNDED_PAGINATION_QUERY_MAX_SIZE } from 'src/app/shared/constants';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from '../user-store/selectors';
import { OrganizationUnitActions } from './actions';
import { selectCurrentUnitUuid, selectOrganizationUnitHasValidCache } from './selectors';

@Injectable()
export class OrganizationUnitEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    @Inject(APIV2OrganizationService) private apiOrganizationService: APIV2OrganizationService,
    @Inject(APIV2OrganizationUnitsInternalINTERNALService)
    private apiUnitService: APIV2OrganizationUnitsInternalINTERNALService,
    @Inject(APIV2OrganizationUnitRegistrationInternalINTERNALService)
    private apiRegistrationsService: APIV2OrganizationUnitRegistrationInternalINTERNALService
  ) {}

  getOrganizationUnits$ = createEffect(() => {
    // eslint-disable-next-line @ngrx/avoid-cyclic-effects
    return this.actions$.pipe(
      ofType(OrganizationUnitActions.getOrganizationUnits),
      concatLatestFrom(() => [
        this.store.select(selectOrganizationUuid).pipe(filterNullish()),
        this.store.select(selectOrganizationUnitHasValidCache),
      ]),
      filter(([_, __, validCache]) => {
        return !validCache;
      }),
      switchMap(([{ units, currentPage, pageSize }, organizationUuid]) =>
        this.apiOrganizationService
          .getManyOrganizationV2GetOrganizationUnits({
            organizationUuid,
            page: currentPage,
            pageSize: pageSize,
          })
          .pipe(
            map((newUnits) => {
              const allUnits = (units ?? []).concat(newUnits);
              const maxPageSize = pageSize ?? BOUNDED_PAGINATION_QUERY_MAX_SIZE;
              if (newUnits.length < maxPageSize) {
                return OrganizationUnitActions.getOrganizationUnitsSuccess(allUnits);
              }
              const nextPage = (currentPage ?? 0) + 1;
              return OrganizationUnitActions.getOrganizationUnits(maxPageSize, nextPage, allUnits);
            }),
            catchError(() => of(OrganizationUnitActions.getOrganizationUnitsError()))
          )
      )
    );
  });

  deleteOrganizationUnit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUnitActions.deleteOrganizationUnit),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([{ uuid }, organizationUuid]) =>
        this.apiUnitService
          .deleteSingleOrganizationUnitsInternalV2DeleteUnit({
            organizationUuid,
            organizationUnitUuid: uuid,
          })
          .pipe(
            map(() => OrganizationUnitActions.deleteOrganizationUnitSuccess(uuid)),
            catchError(() => of(OrganizationUnitActions.deleteOrganizationUnitError()))
          )
      )
    );
  });

  createOrganizationSubunit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUnitActions.createOrganizationSubunit),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(
        ([
          {
            subunitToCreate: { name, parentUuid, localId, ean },
          },
          organizationUuid,
        ]) => {
          return this.apiUnitService
            .postSingleOrganizationUnitsInternalV2CreateUnit({
              organizationUuid,
              parameters: {
                name,
                parentUuid,
                origin: 'Kitos',
                localId,
                ean,
              },
            })
            .pipe(
              map((unit: any) => OrganizationUnitActions.createOrganizationSubunitSuccess(unit)),
              catchError(() => of(OrganizationUnitActions.createOrganizationSubunitError()))
            );
        }
      )
    );
  });

  patchOrganizationUnit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUnitActions.patchOrganizationUnit),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ unitUuid, request }, organizationUuid]) =>
        this.apiUnitService
          .patchSingleOrganizationUnitsInternalV2PatchUnit({
            organizationUuid,
            organizationUnitUuid: unitUuid,
            parameters: request,
          })
          .pipe(
            map((unit: any) => OrganizationUnitActions.patchOrganizationUnitSuccess(unit)),
            catchError(() => of(OrganizationUnitActions.patchOrganizationUnitError()))
          )
      )
    );
  });

  addOrganizationUnitRoleAssignment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUnitActions.addOrganizationUnitRole),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      concatLatestFrom(() => this.store.select(selectCurrentUnitUuid).pipe(filterNullish())),
      switchMap(([[{ userUuid, roleUuid }, organizationUuid], organizationUnitUuid]) =>
        this.apiUnitService
          .postSingleOrganizationUnitsInternalV2CreateRoleAssignment({
            organizationUuid,
            organizationUnitUuid,
            request: {
              roleUuid,
              userUuid,
            },
          })
          .pipe(
            map(() => OrganizationUnitActions.addOrganizationUnitRoleSuccess()),
            catchError(() => of(OrganizationUnitActions.addOrganizationUnitRoleError()))
          )
      )
    );
  });

  deleteOrganizationUnitRoleAssignment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUnitActions.deleteOrganizationUnitRole),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ userUuid, roleUuid, unitUuid }, organizationUuid]) =>
        this.apiUnitService
          .deleteSingleOrganizationUnitsInternalV2DeleteRoleAssignment({
            organizationUuid,
            organizationUnitUuid: unitUuid,
            request: {
              roleUuid,
              userUuid,
            },
          })
          .pipe(
            map(() => OrganizationUnitActions.deleteOrganizationUnitRoleSuccess()),
            catchError(() => of(OrganizationUnitActions.deleteOrganizationUnitRoleError()))
          )
      )
    );
  });

  getRegistrations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUnitActions.getRegistrations),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ unitUuid }, organizationUuid]) =>
        this.apiRegistrationsService
          .getSingleOrganizationUnitRegistrationInternalV2GetRegistrations({
            organizationUuid,
            unitUuid,
          })
          .pipe(
            map((registrations: APIOrganizationRegistrationUnitResponseDTO) =>
              OrganizationUnitActions.getRegistrationsSuccess(registrations)
            ),
            catchError(() => of(OrganizationUnitActions.getRegistrationsError()))
          )
      )
    );
  });

  removeRegistrations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUnitActions.removeRegistrations),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ unitUuid, request }, organizationUuid]) =>
        this.apiRegistrationsService
          .deleteSingleOrganizationUnitRegistrationInternalV2RemoveRegistrations({
            organizationUuid,
            unitUuid,
            requestDto: request,
          })
          .pipe(
            map(() => OrganizationUnitActions.removeRegistrationsSuccess(request)),
            catchError(() => of(OrganizationUnitActions.removeRegistrationsError()))
          )
      )
    );
  });

  transferRegistrations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUnitActions.transferRegistrations),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ unitUuid, request }, organizationUuid]) =>
        this.apiRegistrationsService
          .putSingleOrganizationUnitRegistrationInternalV2TransferRegistrations({
            organizationUuid,
            unitUuid,
            requestDto: request,
          })
          .pipe(
            map(() => OrganizationUnitActions.transferRegistrationsSuccess(request)),
            catchError(() => of(OrganizationUnitActions.transferRegistrationsError()))
          )
      )
    );
  });

  getPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUnitActions.getPermissions),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ unitUuid }, organizationUuid]) =>
        this.apiUnitService
          .getSingleOrganizationUnitsInternalV2GetPermissions({
            organizationUuid,
            unitUuid,
          })
          .pipe(
            map((permissions) => OrganizationUnitActions.getPermissionsSuccess(permissions)),
            catchError(() => of(OrganizationUnitActions.getPermissionsError()))
          )
      )
    );
  });

  getCollectionPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUnitActions.getCollectionPermissions),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([_, organizationUuid]) =>
        this.apiUnitService
          .getSingleOrganizationUnitsInternalV2GetCollectionPermissions({
            organizationUuid,
          })
          .pipe(
            map((permissions) => OrganizationUnitActions.getCollectionPermissionsSuccess(permissions)),
            catchError(() => of(OrganizationUnitActions.getCollectionPermissionsError()))
          )
      )
    );
  });
}
