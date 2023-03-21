import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { APIV2OrganizationService } from 'src/app/api/v2';
import { OrganizationUnitActions } from './actions';

@Injectable()
export class OrganizationUnitEffects {
  constructor(private actions$: Actions, private apiOrganizationService: APIV2OrganizationService) {}

  getOrganizationUnits$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUnitActions.getOrganizationUnits),
      switchMap(({ organizationUuid }) =>
        this.apiOrganizationService
          .gETOrganizationV2GetOrganizationUnitsBoundedPaginationQueryPaginationQueryGuidOrganizationUuidNullable1ChangedSinceGtEqStringNameQuery(
            organizationUuid
          )
          .pipe(
            map((units) => OrganizationUnitActions.getOrganizationUnitsSuccess(units)),
            catchError(() => of(OrganizationUnitActions.getOrganizationUnitsError()))
          )
      )
    );
  });
}
