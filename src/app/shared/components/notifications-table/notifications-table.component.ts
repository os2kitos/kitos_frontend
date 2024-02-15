import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { APINotificationResponseDTO } from 'src/app/api/v2';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { BaseComponent } from '../../base/base.component';
import { notificationRepetitionFrequencyOptions } from '../../models/notification-repetition-frequency.model';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { filterNullish } from '../../pipes/filter-nullish';
import { invertBooleanValue } from '../../pipes/invert-boolean-value';
import { matchEmptyArray } from '../../pipes/match-empty-array';
import { ConfirmActionCategory, ConfirmActionService } from '../../services/confirm-action.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationsTableComponentStore } from './notifications-table.component-store';
import { NotificationsTableCreateDialogComponent } from './notifications-table.create-dialog/notifications-table.create-dialog.component';

@Component({
  selector: 'app-notifications-table[entityUuid][entityType][hasModifyPermission][organizationUuid]',
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
    private readonly confirmationService: ConfirmActionService,
    private readonly notificationService: NotificationService,
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
    this.componentStore.getNotificationsByEntityUuid({ entityUuid: this.entityUuid, organizationUuid: this.organizationUuid })
  }

  public formatDate(date: string | undefined) {
    if (date) return new Date(date).toLocaleDateString();
    return this.nullPlaceholder;
  }

  public onEdit(notification: APINotificationResponseDTO) {
    console.log('todo')
  }

  public onDeactivate(notification: APINotificationResponseDTO) {
    this.confirmationService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på at du vil deaktivere ${this.getSpecificNotificationWarning(notification.name)}?`,
      onConfirm: () => {
        if (notification.uuid) this.componentStore.deactivateNotification({ notificationUuid: notification.uuid, ownerResourceUuid: this.entityUuid, organizationUuid: this.organizationUuid })
        else this.notificationService.showError($localize`Fejl: kan ikke deaktivere en advis uden uuid.`)
      }
    })
  }

  public onRemove(notification: APINotificationResponseDTO) {
    this.confirmationService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på at du vil fjerne ${this.getSpecificNotificationWarning(notification.name)}?`,
      onConfirm: () => {
        if (notification.uuid) this.componentStore.deleteNotification({ notificationUuid: notification.uuid, ownerResourceUuid: this.entityUuid, organizationUuid: this.organizationUuid })
        else this.notificationService.showError($localize`Fejl: kan ikke slette en advis uden uuid.`)
      }
    })
  }

  public onAddNew() {
    this.subscriptions.add(
      this.systemUsageRolesOptions$.subscribe((options) => {
        const dialogRef = this.dialog.open(NotificationsTableCreateDialogComponent);
        dialogRef.componentInstance.systemUsageRolesOptions = options;
        dialogRef.componentInstance.title = $localize`Tilføj advis`,
        dialogRef.componentInstance.notificationRepetitionFrequencyOptions = notificationRepetitionFrequencyOptions;
        dialogRef.componentInstance.ownerEntityUuid = this.entityUuid;
        dialogRef.componentInstance.organizationUuid = this.organizationUuid;
      })
    )
  }

  private getSpecificNotificationWarning(name: string | undefined): string {
    return name ? $localize`advisen "${name}"` : $localize`denne advis`;
}
}

