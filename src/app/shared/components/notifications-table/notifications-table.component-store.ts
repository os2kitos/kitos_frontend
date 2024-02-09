import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { Observable, mergeMap } from "rxjs";
import { APINotificationResponseDTO, APIV2NotificationINTERNALService } from "src/app/api/v2";
import { filterNullish } from "src/app/shared/pipes/filter-nullish";
import { RoleOptionTypes } from "../../models/options/role-option-types.model";

interface State {
  notifications: Array<APINotificationResponseDTO>,
  notificationsLoading: boolean
}

@Injectable()
export class NotificationsTableComponentStore extends ComponentStore<State> {


  public readonly notifications$ = this.select((state) => state.notifications).pipe(filterNullish());

  constructor(
    private readonly store: Store,
    private readonly apiNotificationsService: APIV2NotificationINTERNALService,
  ) {
    super({notifications: [], notificationsLoading: false})
  }

  public getNotificationsByEntityUuid = this.effect(
  (params$: Observable<{ entityUuid: string, entityType: RoleOptionTypes, organizationUuid: string }>) => params$.pipe(
      mergeMap((params) => {
        console.log('in store')
        this.updateNotificationsIsLoading(true);
        return this.apiNotificationsService.getManyNotificationV2GetNotifications({
          ownerResourceType: "ItSystemUsage",
        //  ownerResourceUuid: params.entityUuid,
          organizationUuid: params.organizationUuid
        });
      })
    ).pipe(
      tapResponse(
        (notifications) => this.updateNotifications(notifications),
        (e) => console.error(e),
        () => this.updateNotificationsIsLoading(false)
      )
    )
  )

  private updateNotifications = this.updater(
    (state, notifications: Array<APINotificationResponseDTO>): State => ({
      ...state,
      notifications
    })
  )

  private updateNotificationsIsLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      notificationsLoading: loading
    })
  );
}
