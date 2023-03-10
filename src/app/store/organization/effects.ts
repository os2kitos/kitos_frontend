import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { APIV2OrganizationService } from 'src/app/api/v2';
import { OrganizationActions } from './actions';

@Injectable()
export class OrganizationEffects {
  constructor(private actions$: Actions, private apiOrganizationService: APIV2OrganizationService) {}

  getBusinessTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.getOrganizations),
      switchMap(() =>
        this.apiOrganizationService
          .gETOrganizationV2GetOrganizationsBoundedPaginationQueryPaginationBooleanOnlyWhereUserHasMembershipStringCvrContentStringNameContentStringNameOrCvrContent(
            true
          )
          .pipe(
            map((response) => OrganizationActions.getOrganizationsSuccess(response)),
            catchError(() => of(OrganizationActions.getOrganizationsError()))
          )
      )
    );
  });
}
