import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, map, of, switchMap } from 'rxjs';
import { APIV2DataProcessingRegistrationService } from 'src/app/api/v2';
import { adaptDataProcessingRegistration } from 'src/app/shared/models/data-processing/data-processing.model';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { OData } from 'src/app/shared/models/odata.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from '../user-store/selectors';
import { DataProcessingActions } from './actions';
import { selectDataProcessingUuid } from './selectors';

@Injectable()
export class DataProcessingEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private dataProcessingService: APIV2DataProcessingRegistrationService,
    private httpClient: HttpClient
  ) {}

  getDataProcessing$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.getDataProcessing),
      switchMap(({ dataProcessingUuid }) =>
        this.dataProcessingService
          .getSingleDataProcessingRegistrationV2GetDataProcessingRegistration({ uuid: dataProcessingUuid })
          .pipe(
            map((dataProcessing) => DataProcessingActions.getDataProcessingSuccess(dataProcessing)),
            catchError(() => of(DataProcessingActions.getDataProcessingError()))
          )
      )
    );
  });

  getDataProcessings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.getDataProcessings),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid)),
      switchMap(([odataString, organizationUuid]) =>
        this.httpClient
          .get<OData>(
            `/odata/DataProcessingRegistrationReadModels?organizationUuid=${organizationUuid}&${odataString.odataString}`
          )
          .pipe(
            map((data) =>
              DataProcessingActions.getDataProcessingsSuccess(
                compact(data.value.map(adaptDataProcessingRegistration)),
                data['@odata.count']
              )
            ),
            catchError(() => of(DataProcessingActions.getDataProcessingsError()))
          )
      )
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.updateGridState),
      switchMap(({ gridState }) => of(DataProcessingActions.getDataProcessings(toODataString(gridState))))
    );
  });

  deleteDataProcessing$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DataProcessingActions.deleteDataProcessing),
      concatLatestFrom(() => this.store.select(selectDataProcessingUuid).pipe(filterNullish())),
      switchMap(([_, uuid]) =>
        this.dataProcessingService
          .deleteSingleDataProcessingRegistrationV2DeleteDataProcessingRegistration({ uuid })
          .pipe(
            map(() => DataProcessingActions.deleteDataProcessingSuccess()),
            catchError(() => of(DataProcessingActions.deleteDataProcessingError()))
          )
      )
    );
  });
}
