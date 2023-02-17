import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, map, of, switchMap } from 'rxjs';
import { APIV2ItSystemUsageDataClassificationTypeService, APIV2ItSystemUsageService } from 'src/app/api/v2';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { adaptITSystemUsage } from 'src/app/shared/models/it-system-usage.model';
import { OData } from 'src/app/shared/models/odata.model';
import { selectOrganizationUuid } from '../user-store/selectors';
import { ITSystemUsageActions } from './actions';

@Injectable()
export class ITSystemUsageEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private httpClient: HttpClient,
    private apiV2ItSystemUsageService: APIV2ItSystemUsageService,
    private apiV2ItSystemUsageDataClassificationTypeService: APIV2ItSystemUsageDataClassificationTypeService
  ) {}

  getItSystemUsages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.getItSystemUsages),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid)),
      switchMap(([{ odataString }, organizationUuid]) =>
        this.httpClient
          .get<OData>(
            `/odata/ItSystemUsageOverviewReadModels?organizationUuid=${organizationUuid}&${odataString}&$count=true`
          )
          .pipe(
            map((data) =>
              ITSystemUsageActions.getItSystemUsagesSuccess(
                compact(data.value.map(adaptITSystemUsage)),
                data['@odata.count']
              )
            ),
            catchError(() => of(ITSystemUsageActions.getItSystemUsagesError()))
          )
      )
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.updateGridState),
      map(({ gridState }) => ITSystemUsageActions.getItSystemUsages(toODataString(gridState, { utcDates: true })))
    );
  });

  getItSystemUsage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.getItSystemUsage),
      switchMap(({ systemUsageUuid }) =>
        this.apiV2ItSystemUsageService.gETItSystemUsageV2GetItSystemUsageGuidSystemUsageUuid(systemUsageUuid).pipe(
          map((itSystemUsage) => ITSystemUsageActions.getItSystemUsageSuccess(itSystemUsage)),
          catchError(() => of(ITSystemUsageActions.getItSystemUsageError()))
        )
      )
    );
  });

  getItSystemUsageDataClassificationType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.getItSystemUsageClassificationTypes),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid)),
      switchMap(([_, organizationUuid]) => {
        if (!organizationUuid) return of(ITSystemUsageActions.getItSystemUsageClassificationTypesError());

        return this.apiV2ItSystemUsageDataClassificationTypeService
          .gETItSystemUsageDataClassificationTypeV2GetUnboundedPaginationQueryPaginationGuidOrganizationUuid(
            organizationUuid
          )
          .pipe(
            map((itSystemUsageDataClacificationTypes) =>
              ITSystemUsageActions.getItSystemUsageClassificationTypesSuccess(itSystemUsageDataClacificationTypes)
            ),
            catchError(() => of(ITSystemUsageActions.getItSystemUsageClassificationTypesError()))
          );
      })
    );
  });
}
