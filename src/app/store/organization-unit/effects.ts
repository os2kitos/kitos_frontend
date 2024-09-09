import { Inject, Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import { Store } from '@ngrx/store';
import { catchError, combineLatestWith, filter, map, of, switchMap } from 'rxjs';

import { APIV2OrganizationService, APIV2OrganizationUnitsInternalINTERNALService } from 'src/app/api/v2';
import { BOUNDED_PAGINATION_QUERY_MAX_SIZE } from 'src/app/shared/constants';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from '../user-store/selectors';
import { OrganizationUnitActions } from './actions';
import { selectOrganizationUnitHasValidCache } from './selectors';

@Injectable()
export class OrganizationUnitEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    @Inject(APIV2OrganizationService) private apiOrganizationService: APIV2OrganizationService,
    @Inject(APIV2OrganizationUnitsInternalINTERNALService)
    private apiUnitService: APIV2OrganizationUnitsInternalINTERNALService
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


  createOrganizationSubunit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUnitActions.createOrganizationSubunit),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(
        ([
          {
            subunitToCreate: { name, parentUnitUuid, localId, ean },
          },
          organizationUuid,
        ]) => {
          return this.apiUnitService
            .postSingleOrganizationUnitsInternalV2CreateUnit({
              organizationUuid,
              parameters: {
                name,
                parentUuid: parentUnitUuid,
                origin: 'Kitos',
                localId,
                ean,
              },
            })
            .pipe(
              map(() => OrganizationUnitActions.createOrganizationSubunitSuccess(name)),
              catchError(() => of(OrganizationUnitActions.createOrganizationSubunitError(name)))
            );
        }))
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
}
