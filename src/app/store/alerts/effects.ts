import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, mergeMap, of, switchMap } from 'rxjs';
import { AlertsV2Service } from 'src/app/api/v2';
import { mapRelatedEntityTypeToDTO } from 'src/app/shared/helpers/entity-type.helper';
import { selectOrganizationUuid, selectUserUuid } from '../user-store/selectors';
import { AlertActions } from './actions';
import { selectAlertCacheTime } from './selectors';
import { adaptAlert } from './state';

@Injectable()
export class AlertsEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private alertsService: AlertsV2Service,
  ) {}

  getAlerts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AlertActions.getAlerts),
      concatLatestFrom(({ entityType }) => [
        this.store.select(selectUserUuid),
        this.store.select(selectOrganizationUuid),
        this.store.select(selectAlertCacheTime(entityType)),
      ]),
      filter(
        ([_, userUuid, organizationUuid, hasValidCache]) =>
          userUuid !== undefined && organizationUuid !== undefined && !hasValidCache,
      ),
      mergeMap(([{ entityType }, userUuid, organizationUuid]) => {
        return this.alertsService
          .getManyAlertsV2GetByOrganizationAndUser({
            organizationUuid: organizationUuid!,
            userUuid: userUuid!,
            ownerResourceType: mapRelatedEntityTypeToDTO(entityType),
          })
          .pipe(
            map((alerts) => AlertActions.getAlertsSuccess(entityType, alerts.map(adaptAlert))),
            catchError(() => of(AlertActions.getAlertsError())),
          );
      }),
    );
  });

  deleteAlert$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AlertActions.deleteAlert),
      switchMap(({ entitType, alertUuid }) => {
        return this.alertsService
          .deleteSingleAlertsV2DeleteAlert({
            alertUuid,
          })
          .pipe(
            map(() => AlertActions.deleteAlertSuccess(entitType, alertUuid)),
            catchError(() => of(AlertActions.deleteAlertError())),
          );
      }),
    );
  });
}
