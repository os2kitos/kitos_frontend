import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { invertBooleanValue } from '../../pipes/invert-boolean-value';
import { matchEmptyArray } from '../../pipes/match-empty-array';
import { NotificationsTableComponentStore } from './notifications-table.component-store';
import { APINotificationResponseDTO } from 'src/app/api/v2';
import { ConfirmActionService } from '../../services/confirm-action.service';

@Component({
  selector: 'app-notifications-table',
  templateUrl: './notifications-table.component.html',
  styleUrls: ['./notifications-table.component.scss'],
  providers: [NotificationsTableComponentStore]
})
export class NotificationsTableComponent extends BaseComponent implements OnInit{
  @Input() entityUuid!: string;
  @Input() entityType!: RoleOptionTypes
  @Input() hasModifyPermission!: boolean;
  @Input() organizationUuid!: string;

  public readonly notifications$ = this.componentStore.notifications$;
  public readonly anyNotifications$ = this.notifications$.pipe(matchEmptyArray(), invertBooleanValue());
  public readonly nullPlaceholder = "---";

  constructor(
    private readonly componentStore: NotificationsTableComponentStore,
    private readonly confirmationService: ConfirmActionService
    ){
      super()
  }

  ngOnInit(): void {
    this.getNotifications();
  }

  private getNotifications() {
    this.componentStore.getNotificationsByEntityUuid({ entityUuid: this.entityUuid, entityType: this.entityType, organizationUuid: this.organizationUuid })
  }

  public formatDate(date: string | undefined) {
    if (date) return new Date(date).toLocaleDateString();
    return this.nullPlaceholder;
  }

  public onEdit(notification: APINotificationResponseDTO) {

  }

  public onRemove(notification: APINotificationResponseDTO) {

  }
}
