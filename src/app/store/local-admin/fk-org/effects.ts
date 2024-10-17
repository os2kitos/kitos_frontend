import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, mergeMap } from 'rxjs';
import { APIV2StsOrganizationSynchronizationInternalINTERNALService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from '../../user-store/selectors';
import { FkOrgActions } from './actions';

@Injectable()
export class FkOrgEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    @Inject(APIV2StsOrganizationSynchronizationInternalINTERNALService)
    private apiService: APIV2StsOrganizationSynchronizationInternalINTERNALService
  ) {}

  getSynchronizationStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FkOrgActions.getSynchronizationStatus),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(({ organizationUuid }) =>
        this.apiService
          .getSingleStsOrganizationSynchronizationInternalV2GetSynchronizationStatus({ organizationUuid })
          .pipe(
            map((itSystem) => ITSystemActions.getITSystemSuccess(itSystem)),
            catchError(() => of(ITSystemActions.getITSystemError()))
          )
      )
    );
  });
}
