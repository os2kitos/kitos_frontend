import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, mergeMap, switchMap, tap } from "rxjs";
import { APIImmediateNotificationWriteRequestDTO, APINotificationResponseDTO, APIScheduledNotificationWriteRequestDTO, APISentNotificationResponseDTO, APIV2NotificationINTERNALService } from "src/app/api/v2";
import { filterNullish } from "src/app/shared/pipes/filter-nullish";

interface State {
  notifications: Array<APINotificationResponseDTO>,
  isLoading: boolean,
  currentNotificationSent: Array<APISentNotificationResponseDTO> | undefined
}

@Injectable()
export class NotificationsTableComponentStore extends ComponentStore<State> {
  public readonly notifications$ = this.select((state) => state.notifications).pipe(filterNullish());
  public readonly notificationsLoading$ = this.select((state) => state.isLoading).pipe(filterNullish());
  public readonly currentNotificationSent$ = this.select((state) => state.currentNotificationSent).pipe(filterNullish());

  private readonly ownerResourceType = "ItSystemUsage";

  constructor(
    private readonly apiNotificationsService: APIV2NotificationINTERNALService,
  ) {
    super({notifications: [], isLoading: false,
          currentNotificationSent: undefined})
  }

  public getCurrentNotificationSent = this.effect((
    params$: Observable<{
      ownerResourceUuid: string;
      notificationUuid: string;
    }>) =>
    params$.pipe(
      mergeMap((params) => {
        return this.apiNotificationsService.getManyNotificationV2GetSentNotification({
          ownerResourceType: this.ownerResourceType,
          ownerResourceUuid: params.ownerResourceUuid,
          notificationUuid: params.notificationUuid
        })
        .pipe(
          tapResponse(
            (currentNotificationSent) => this.updateCurrentNotificationSent(currentNotificationSent),
            (e) => console.error(e),
            () => this.updateIsLoading(false)
          )
       );
      })
    )
  )

  public postImmediateNotification = this.effect(
    (params$: Observable<{
      ownerResourceUuid: string,
      requestBody: APIImmediateNotificationWriteRequestDTO,
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
      requestBody: APIScheduledNotificationWriteRequestDTO
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

  public putScheduledNotification = this.effect(
    (params$: Observable<{
      ownerResourceUuid: string,
      notificationUuid: string,
      requestBody: APIScheduledNotificationWriteRequestDTO
      onComplete: () => void}>) =>
      params$.pipe(
        switchMap((params) => {
          return this.apiNotificationsService.putSingleNotificationV2UpdateScheduledNotification({
            ownerResourceType: this.ownerResourceType,
            ownerResourceUuid: params.ownerResourceUuid,
            notificationUuid: params.notificationUuid,
            request: params.requestBody
          })
          .pipe(
            tap(() => params.onComplete())
          )
        })
      )
  )

  public deleteNotification = this.effect(
    (params$: Observable<{notificationUuid: string, ownerResourceUuid: string, onComplete: () => void  }>) =>
    params$.pipe(
      switchMap((params) => {
        return this.apiNotificationsService.deleteSingleNotificationV2DeleteNotification(
          {notificationUuid: params.notificationUuid,
          ownerResourceType: this.ownerResourceType,
          ownerResourceUuid: params.ownerResourceUuid
        })
        .pipe(
            tap(() => params.onComplete())
          )
        })
      )
  );

  public deactivateNotification = this.effect(
    (params$: Observable<{ ownerResourceUuid: string, notificationUuid: string, organizationUuid: string, onComplete: () => void }>) =>
    params$.pipe(
      switchMap((params) => {
        return this.apiNotificationsService.patchSingleNotificationV2DeactivateScheduledNotification({
          ownerResourceType: this.ownerResourceType,
          ownerResourceUuid: params.ownerResourceUuid,
          notificationUuid: params.notificationUuid
        })
        .pipe(
          tap(() => params.onComplete())
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

  private updateCurrentNotificationSent = this.updater(
    (state, currentNotificationSent: Array<APISentNotificationResponseDTO>): State => ({
      ...state,
      currentNotificationSent
    })
  )

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
