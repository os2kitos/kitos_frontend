import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { APIV2ItSystemUsageDataClassificationTypeService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from '../user-store/selectors';
import { DataClassificationTypeActions } from './actions';
import { selectHasValidCache } from './selectors';

@Injectable()
export class DataClassificationTypeEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private apiItSystemUsageDataClassificationTypeService: APIV2ItSystemUsageDataClassificationTypeService
  ) {}

  getDataClassificationTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataClassificationTypeActions.getDataClassificationTypes),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid), this.store.select(selectHasValidCache)]),
      filter(([_, __, validCache]) => !validCache),
      map(([_, organizationUuid]) => organizationUuid),
      filterNullish(),
      switchMap((organizationUuid) =>
        this.apiItSystemUsageDataClassificationTypeService
          .getManyItSystemUsageDataClassificationTypeV2Get({ organizationUuid: organizationUuid })
          .pipe(
            map((response) => DataClassificationTypeActions.getDataClassificationTypesSuccess(response)),
            catchError(() => of(DataClassificationTypeActions.getDataClassificationTypesError()))
          )
      )
    );
  });
}
