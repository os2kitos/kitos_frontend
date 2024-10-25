import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

@Injectable()
export class FkOrgEffects {
  constructor(private actions$: Actions, private store: Store) {}

  /* getSynchronizationStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ExcelImportActions.excelImport),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([_, organizationUuid]) =>
        this.apiService
          .getSingleStsOrganizationSynchronizationInternalV2GetSynchronizationStatus({ organizationUuid })
          .pipe(
            map((synchronizationStatus) => FkOrgActions.getSynchronizationStatusSuccess(synchronizationStatus)),
            catchError(() => of(FkOrgActions.getSynchronizationStatusError()))
          )
      )
    );
  }); */
}
