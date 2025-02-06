import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { APIV2GdprExportReportInternalINTERNALService } from 'src/app/api/v2';
import { adaptGdprReport } from 'src/app/shared/models/it-system-usage/gdpr/gdpr-report.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from '../../user-store/selectors';
import { GdprReportActions } from './actions';
import { selectGdprReportHasValidCache } from './selectors';

@Injectable()
export class GdprReportEffects {
  constructor(
    private gdprReportService: APIV2GdprExportReportInternalINTERNALService,
    private actions$: Actions,
    private store: Store
  ) {}

  getGdprReport$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GdprReportActions.getGDPRReports),
      concatLatestFrom(() => [
        this.store.select(selectOrganizationUuid).pipe(filterNullish()),
        this.store.select(selectGdprReportHasValidCache()),
      ]),
      filter(([_, __, validCache]) => !validCache),
      map(([, organizationUuid]) => organizationUuid),
      switchMap((organizationUuid) =>
        this.gdprReportService.getManyGdprExportReportInternalV2GetGdprReport({ organizationUuid }).pipe(
          map((reports) => GdprReportActions.getGDPRReportsSuccess(reports.map(adaptGdprReport))),
          catchError(() => of(GdprReportActions.getGDPRReportsError()))
        )
      )
    );
  });
}
