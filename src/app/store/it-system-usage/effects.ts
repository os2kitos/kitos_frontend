import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { APIUpdateItSystemUsageRequestDTO, APIV2ItSystemUsageService } from 'src/app/api/v2';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { adaptITSystemUsage } from 'src/app/shared/models/it-system-usage.model';
import { OData } from 'src/app/shared/models/odata.model';
import { selectOrganizationUuid } from '../user-store/selectors';
import { ITSystemUsageActions } from './actions';
import {
  selectItSystemUsageResponsibleUnit,
  selectItSystemUsageUsingOrganizationUnits,
  selectItSystemUsageUuid,
} from './selectors';

@Injectable()
export class ITSystemUsageEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private httpClient: HttpClient,
    private apiV2ItSystemUsageService: APIV2ItSystemUsageService
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
        this.apiV2ItSystemUsageService.getSingleItSystemUsageV2GetItSystemUsage({ systemUsageUuid }).pipe(
          map((itSystemUsage) => ITSystemUsageActions.getItSystemUsageSuccess(itSystemUsage)),
          catchError(() => of(ITSystemUsageActions.getItSystemUsageError()))
        )
      )
    );
  });

  removeItSystemUsage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.removeItSystemUsage),
      concatLatestFrom(() => this.store.select(selectItSystemUsageUuid)),
      switchMap(([_, systemUsageUuid]) => {
        if (!systemUsageUuid) return of(ITSystemUsageActions.removeItSystemUsageError());

        return this.apiV2ItSystemUsageService.deleteSingleItSystemUsageV2DeleteItSystemUsage({ systemUsageUuid }).pipe(
          map(() => ITSystemUsageActions.removeItSystemUsageSuccess()),
          catchError(() => of(ITSystemUsageActions.removeItSystemUsageError()))
        );
      })
    );
  });

  removeItSystemUsageUsingUnit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.removeItSystemUsageUsingUnit),
      concatLatestFrom(() => [
        this.store.select(selectItSystemUsageResponsibleUnit),
        this.store.select(selectItSystemUsageUsingOrganizationUnits),
      ]),
      switchMap(([{ usingUnitToRemoveUuid }, responsibleUnit, usingUnits]) => {
        const unitUuids = usingUnits?.filter((x) => x.uuid !== usingUnitToRemoveUuid).map((x) => x.uuid);
        const requestBody = {
          organizationUsage: {
            usingOrganizationUnitUuids: unitUuids,
            responsibleOrganizationUnitUuid: responsibleUnit?.uuid === usingUnitToRemoveUuid ? null : undefined,
          },
        } as APIUpdateItSystemUsageRequestDTO;

        return of(ITSystemUsageActions.patchItSystemUsage(requestBody, $localize`Relevant organisationsenhed fjernet`));
      })
    );
  });

  patchItSystemUsage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.patchItSystemUsage),
      concatLatestFrom(() => this.store.select(selectItSystemUsageUuid)),
      mergeMap(([{ itSystemUsage, customSuccessText }, systemUsageUuid]) => {
        if (!systemUsageUuid) return of(ITSystemUsageActions.patchItSystemUsageError());

        return this.apiV2ItSystemUsageService
          .patchSingleItSystemUsageV2PatchSystemUsage({
            systemUsageUuid,
            request: itSystemUsage,
          })
          .pipe(
            map((itSystemUsage) => {
              return ITSystemUsageActions.patchItSystemUsageSuccess(itSystemUsage, customSuccessText);
            }),
            catchError(() => of(ITSystemUsageActions.patchItSystemUsageError()))
          );
      })
    );
  });

  getItSystemUsagePermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.getItSystemUsagePermissions),
      switchMap(({ systemUsageUuid }) =>
        this.apiV2ItSystemUsageService.getSingleItSystemUsageV2GetItSystemUsagePermissions({ systemUsageUuid }).pipe(
          map((permissions) => ITSystemUsageActions.getItSystemUsagePermissionsSuccess(permissions)),
          catchError(() => of(ITSystemUsageActions.getItSystemUsagePermissionsError()))
        )
      )
    );
  });
}
