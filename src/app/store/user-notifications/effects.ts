import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { APIV2NotificationINTERNALService } from 'src/app/api/v2';
import { UserNotificationActions } from './actions';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { selectOrganizationUuid } from '../user-store/selectors';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { adaptUserNotification } from './state';
import { selectHasValidCacheForResourceType } from './selectors';

@Injectable()
export class UserNotificationsEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private notificationService: APIV2NotificationINTERNALService
  ) {}

  getNotifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserNotificationActions.getNotifications),
      concatLatestFrom(({ ownerResourceType }) => [
        this.store.select(selectOrganizationUuid).pipe(filterNullish()),
        this.store.select(selectHasValidCacheForResourceType(ownerResourceType)),
      ]),
      filter(([, , hasValidCache]) => !hasValidCache),
      switchMap(([{ ownerResourceType }, organizationUuid]) =>
        this.notificationService
          .getManyNotificationV2GetNotifications({ ownerResourceType, organizationUuid, onlyActive: true })
          .pipe(
            map((notifications) =>
              UserNotificationActions.getNotificationsSuccess(
                ownerResourceType,
                notifications.map(adaptUserNotification)
              )
            ),
            catchError(() => of(UserNotificationActions.getNotificationsError()))
          )
      )
    );
  });
}
