import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { Observable, mergeMap, switchMap } from "rxjs";
import { APINotificationResponseDTO, APIV2NotificationINTERNALService } from "src/app/api/v2";
import { filterNullish } from "src/app/shared/pipes/filter-nullish";
import { RoleOptionTypes } from "../../models/options/role-option-types.model";

interface State {
  notifications: Array<APINotificationResponseDTO>,
  isLoading: boolean
}

@Injectable()
export class NotificationsTableComponentStore extends ComponentStore<State> {
  public readonly notifications$ = this.select((state) => state.notifications).pipe(filterNullish());
  public readonly notificationsLoading$ = this.select((state) => state.isLoading).pipe(filterNullish());

  constructor(
    private readonly apiNotificationsService: APIV2NotificationINTERNALService,
  ) {
    super({notifications: [], isLoading: false})
  }

  public deleteNotification = this.effect(
    (params$: Observable<{notificationUuid: string, ownerEntityUuid: string}>) =>
    params$.pipe(
      switchMap((params) => {
        return this.apiNotificationsService.deleteSingleNotificationV2DeleteNotification(
          {notificationUuid: params.notificationUuid,
          ownerResourceType: "ItSystemUsage",
          ownerResourceUuid: params.ownerEntityUuid })
        })
      )
  )

  public getNotificationsByEntityUuid = this.effect(
  (params$: Observable<{ entityUuid: string, entityType: RoleOptionTypes, organizationUuid: string }>) =>
  params$.pipe(
      mergeMap((params) => {
        this.updateIsLoading(true);
        return this.apiNotificationsService.getManyNotificationV2GetNotifications({
          ownerResourceType: "ItSystemUsage",
          ownerResourceUuid: params.entityUuid,
          organizationUuid: params.organizationUuid
        })
    .pipe(
       tapResponse(
         (notifications) => this.updateNotifications(notifications),
         (e) => console.error(e),
         () => this.updateIsLoading(false)
       )
    );
    }))
  );

  private updateNotifications = this.updater(
    (state, notifications: Array<APINotificationResponseDTO>): State => ({
      ...state,
      notifications
    })
  )

  private updateIsLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      isLoading: loading
    })
  );
}
