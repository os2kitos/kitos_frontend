import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { APIV2OrganizationsInternalINTERNALService } from 'src/app/api/v2';
import { OrganizationMasterDataActions } from './actions';

@Injectable()
export class OrganizationMasterDataEffects {
  constructor(
    @Inject(APIV2OrganizationsInternalINTERNALService)
    private organizationInternalService: APIV2OrganizationsInternalINTERNALService,
    private actions$: Actions
  ) {}

  getMasterData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationMasterDataActions.getMasterData),
      switchMap(({ organizationUuid }) =>
        this.organizationInternalService
          .getSingleOrganizationsInternalV2GetOrganizationMasterData({ organizationUuid })
          .pipe(
            map((organizationMasterData) => OrganizationMasterDataActions.getMasterDataSuccess(organizationMasterData)),
            catchError(() => of(OrganizationMasterDataActions.getMasterDataError()))
          )
      )
    );
  });
}
