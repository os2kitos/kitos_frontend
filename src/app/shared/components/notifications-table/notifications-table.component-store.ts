import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, mergeMap, switchMap, tap } from "rxjs";
import { APIImmediateNotificationWriteRequestDTO, APINotificationResponseDTO, APIScheduledNotificationWriteRequestDTO, APIV2NotificationINTERNALService } from "src/app/api/v2";
import { filterNullish } from "src/app/shared/pipes/filter-nullish";

interface State {
  notifications: Array<APINotificationResponseDTO>,
  isLoading: boolean
}

@Injectable()
export class NotificationsTableComponentStore extends ComponentStore<State> {
  public readonly notifications$ = this.select((state) => state.notifications).pipe(filterNullish());
  public readonly notificationsLoading$ = this.select((state) => state.isLoading).pipe(filterNullish());

  private readonly ownerResourceType = "ItSystemUsage";

  constructor(
    private readonly apiNotificationsService: APIV2NotificationINTERNALService,
  ) {
    super({notifications: [], isLoading: false})
  }

  public postImmediateNotification = this.effect(
    (params$: Observable<{
      ownerResourceUuid: string,
      requestBody: APIImmediateNotificationWriteRequestDTO,
      organizationUuid: string,
      onComplete: () => void}>) =>
    params$.pipe(
      switchMap((params) => {
        return this.apiNotificationsService.postSingleNotificationV2CreateImmediateNotification({
            ownerResourceType: this.ownerResourceType,
            ownerResourceUuid: params.ownerResourceUuid,
            request: params.requestBody
        })
        .pipe(
          tap(() => params.onComplete())
        )
      })
    )
  )

  public postScheduledNotification = this.effect(
    (params$: Observable<{
      ownerResourceUuid: string,
      requestBody: APIScheduledNotificationWriteRequestDTO,
      organizationUuid: string,
      onComplete: () => void}>) =>
    params$.pipe(
      switchMap((params) => {
        return this.apiNotificationsService.postSingleNotificationV2CreateScheduledNotification({
            ownerResourceType: this.ownerResourceType,
            ownerResourceUuid: params.ownerResourceUuid,
            request: params.requestBody
        })
        .pipe(
          tap(() => params.onComplete())
        )
      })
    )
  )

  public deleteNotification = this.effect(
    (params$: Observable<{notificationUuid: string, ownerResourceUuid: string, organizationUuid: string }>) =>
    params$.pipe(
      switchMap((params) => {
        return this.apiNotificationsService.deleteSingleNotificationV2DeleteNotification(
          {notificationUuid: params.notificationUuid,
          ownerResourceType: this.ownerResourceType,
          ownerResourceUuid: params.ownerResourceUuid
        })
        .pipe(
            tap(() => this.getNotificationsByEntityUuid({entityUuid: params.ownerResourceUuid, organizationUuid: params.organizationUuid }))
          )
        })
      )
  );

  public deactivateNotification = this.effect(
    (params$: Observable<{ ownerResourceUuid: string, notificationUuid: string, organizationUuid: string }>) =>
    params$.pipe(
      switchMap((params) => {
        return this.apiNotificationsService.patchSingleNotificationV2DeactivateScheduledNotification({
          ownerResourceType: this.ownerResourceType,
          ownerResourceUuid: params.ownerResourceUuid,
          notificationUuid: params.notificationUuid
        })
        .pipe(
          tap(() => this.getNotificationsByEntityUuid({entityUuid: params.ownerResourceUuid, organizationUuid: params.organizationUuid }))
        )
      })
    )
  );

  public getNotificationsByEntityUuid = this.effect(
  (params$: Observable<{ entityUuid: string, organizationUuid: string }>) =>
  params$.pipe(
      mergeMap((params) => {
        this.updateIsLoading(true);
        return this.apiNotificationsService.getManyNotificationV2GetNotifications({
          ownerResourceType: this.ownerResourceType,
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
