import { Component, Input, OnInit } from '@angular/core';
import { APINotificationResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from '../../base/base.component';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { invertBooleanValue } from '../../pipes/invert-boolean-value';
import { matchEmptyArray } from '../../pipes/match-empty-array';
import { ConfirmActionCategory, ConfirmActionService } from '../../services/confirm-action.service';
import { NotificationsTableComponentStore } from './notifications-table.component-store';
import { map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { NotificationService } from '../../services/notification.service';
import { NotificationsTableCreateDialogComponent } from './notifications-table.create-dialog/notifications-table.create-dialog.component';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { filterNullish } from '../../pipes/filter-nullish';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';

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
  public readonly isLoading$ = this.componentStore.notificationsLoading$;
  public readonly systemUsageRolesOptions$ = this.store.select(selectRegularOptionTypes('it-system-usage-roles'))
  .pipe(filterNullish(),
    map(options => options.sort((a, b) => a.name.localeCompare(b.name)))
  );
  public readonly nullPlaceholder = "---";

  constructor(
    private readonly componentStore: NotificationsTableComponentStore,
    private readonly confirmationService: ConfirmActionService
    private readonly dialog: MatDialog,
    private readonly store: Store,
    ){
      super()
  }

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system-usage-roles'));
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

    console.log('todo')
  }

  public onRemove(notification: APINotificationResponseDTO) {

  public onAddNew() {
    this.subscriptions.add(
      this.systemUsageRolesOptions$.subscribe((options) => {
        const dialogRef = this.dialog.open(NotificationsTableCreateDialogComponent);
        dialogRef.componentInstance.systemUsageRolesOptions = options
      })
    )
  }
}
