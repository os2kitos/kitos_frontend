import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { NotificationV2Service } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from '../user-store/selectors';
import { UserNotificationActions } from './actions';
import { selectHasValidCacheForResourceType } from './selectors';
import { adaptUserNotification } from './state';

@Injectable()
export class UserNotificationsEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private notificationService: NotificationV2Service,
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
                notifications.map(adaptUserNotification),
              ),
            ),
            catchError(() => of(UserNotificationActions.getNotificationsError())),
          ),
      ),
    );
  });
}
