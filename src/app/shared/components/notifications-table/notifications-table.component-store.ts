import { Inject, Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { Observable, combineLatestWith, mergeMap, switchMap, tap } from 'rxjs';
import {
  APIImmediateNotificationWriteRequestDTO,
  APINotificationResponseDTO,
  APIScheduledNotificationWriteRequestDTO,
  APISentNotificationResponseDTO,
  APIV2NotificationINTERNALService,
} from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { NotificationEntityType } from '../../models/notification-entity-types';

interface State {
  notifications: Array<APINotificationResponseDTO>;
  isLoading: boolean;
  currentNotificationSent: Array<APISentNotificationResponseDTO> | undefined;
}

@Injectable()
export class NotificationsTableComponentStore extends ComponentStore<State> {
  public readonly notifications$ = this.select((state) => state.notifications).pipe(filterNullish());
  public readonly notificationsLoading$ = this.select((state) => state.isLoading).pipe(filterNullish());
  public readonly currentNotificationSent$ = this.select((state) => state.currentNotificationSent).pipe(
    filterNullish()
  );

  constructor(
    private readonly store: Store,
    @Inject(APIV2NotificationINTERNALService) private readonly apiNotificationsService: APIV2NotificationINTERNALService
  ) {
    super({ notifications: [], isLoading: false, currentNotificationSent: undefined });
  }

  public getCurrentNotificationSent = this.effect(
    (
      params$: Observable<{
        ownerResourceType: NotificationEntityType;
        ownerResourceUuid: string;
        notificationUuid: string;
      }>
    ) =>
      params$.pipe(
        mergeMap((params) => {
          return this.apiNotificationsService
            .getManyNotificationV2GetSentNotification({
              ownerResourceType: params.ownerResourceType,
              ownerResourceUuid: params.ownerResourceUuid,
              notificationUuid: params.notificationUuid,
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
  );

  public postImmediateNotification = this.effect(
    (
      params$: Observable<{
        ownerResourceType: NotificationEntityType;
        ownerResourceUuid: string;
        requestBody: APIImmediateNotificationWriteRequestDTO;
        onComplete: () => void;
      }>
    ) =>
      params$.pipe(
        switchMap((params) => {
          return this.apiNotificationsService
            .postSingleNotificationV2CreateImmediateNotification({
              ownerResourceType: params.ownerResourceType,
              ownerResourceUuid: params.ownerResourceUuid,
              request: params.requestBody,
            })
            .pipe(tap(() => params.onComplete()));
        })
      )
  );

  public postScheduledNotification = this.effect(
    (
      params$: Observable<{
        ownerResourceType: NotificationEntityType;
        ownerResourceUuid: string;
        requestBody: APIScheduledNotificationWriteRequestDTO;
        onComplete: () => void;
      }>
    ) =>
      params$.pipe(
        switchMap((params) => {
          return this.apiNotificationsService
            .postSingleNotificationV2CreateScheduledNotification({
              ownerResourceType: params.ownerResourceType,
              ownerResourceUuid: params.ownerResourceUuid,
              request: params.requestBody,
            })
            .pipe(tap(() => params.onComplete()));
        })
      )
  );

  public putScheduledNotification = this.effect(
    (
      params$: Observable<{
        ownerResourceType: NotificationEntityType;
        ownerResourceUuid: string;
        notificationUuid: string;
        requestBody: APIScheduledNotificationWriteRequestDTO;
        onComplete: () => void;
      }>
    ) =>
      params$.pipe(
        switchMap((params) => {
          return this.apiNotificationsService
            .putSingleNotificationV2UpdateScheduledNotification({
              ownerResourceType: params.ownerResourceType,
              ownerResourceUuid: params.ownerResourceUuid,
              notificationUuid: params.notificationUuid,
              request: params.requestBody,
            })
            .pipe(tap(() => params.onComplete()));
        })
      )
  );

  public deleteNotification = this.effect(
    (
      params$: Observable<{
        ownerResourceType: NotificationEntityType;
        notificationUuid: string;
        ownerResourceUuid: string;
        onComplete: () => void;
      }>
    ) =>
      params$.pipe(
        switchMap((params) => {
          return this.apiNotificationsService
            .deleteSingleNotificationV2DeleteNotification({
              notificationUuid: params.notificationUuid,
              ownerResourceType: params.ownerResourceType,
              ownerResourceUuid: params.ownerResourceUuid,
            })
            .pipe(tap(() => params.onComplete()));
        })
      )
  );

  public deactivateNotification = this.effect(
    (
      params$: Observable<{
        ownerResourceType: NotificationEntityType;
        ownerResourceUuid: string;
        notificationUuid: string;
        onComplete: () => void;
      }>
    ) =>
      params$.pipe(
        switchMap((params) => {
          return this.apiNotificationsService
            .patchSingleNotificationV2DeactivateScheduledNotification({
              ownerResourceType: params.ownerResourceType,
              ownerResourceUuid: params.ownerResourceUuid,
              notificationUuid: params.notificationUuid,
            })
            .pipe(tap(() => params.onComplete()));
        })
      )
  );

  public getNotificationsByEntityUuid = this.effect(
    (
      params$: Observable<{
        ownerResourceType: NotificationEntityType;
        entityUuid: string;
      }>
    ) =>
      params$.pipe(
        combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
        mergeMap(([{ ownerResourceType, entityUuid }, organizationUuid]) => {
          this.updateIsLoading(true);
          return this.apiNotificationsService
            .getManyNotificationV2GetNotifications({
              ownerResourceType: ownerResourceType,
              ownerResourceUuid: entityUuid,
              organizationUuid: organizationUuid,
            })
            .pipe(
              tapResponse(
                (notifications) => this.updateNotifications(notifications),
                (e) => console.error(e),
                () => this.updateIsLoading(false)
              )
            );
        })
      )
  );

  private updateCurrentNotificationSent = this.updater(
    (state, currentNotificationSent: Array<APISentNotificationResponseDTO>): State => ({
      ...state,
      currentNotificationSent,
    })
  );

  private updateNotifications = this.updater(
    (state, notifications: Array<APINotificationResponseDTO>): State => ({
      ...state,
      notifications,
    })
  );

  private updateIsLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      isLoading: loading,
    })
  );
}
