import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import {
  APIEmailRecipientResponseDTO,
  APINotificationResponseDTO,
  APIRegularOptionResponseDTO,
  APIRoleOptionResponseDTO,
  APIRoleRecipientResponseDTO,
} from 'src/app/api/v2';
import { RoleOptionTypeActions } from 'src/app/store/roles-option-type-store/actions';
import { selectRoleOptionTypes } from 'src/app/store/roles-option-type-store/selectors';
import { UserNotificationActions } from 'src/app/store/user-notifications/actions';
import { BaseComponent } from '../../base/base.component';
import { NotificationEntityType, NotificationEntityTypeEnum } from '../../models/notification-entity-types';
import { notificationRepetitionFrequencyOptions } from '../../models/notification-repetition-frequency.model';
import { notificationTypeOptions } from '../../models/notification-type.model';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { filterNullish } from '../../pipes/filter-nullish';
import { invertBooleanValue } from '../../pipes/invert-boolean-value';
import { matchEmptyArray } from '../../pipes/match-empty-array';
import { ConfirmActionCategory, ConfirmActionService } from '../../services/confirm-action.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationsTableDialogComponent } from './notifications-table-dialog/notifications-table-dialog.component';
import { NotificationsTableSentDialogComponent } from './notifications-table-sent-dialog/notifications-table-sent-dialog.component';
import { NotificationsTableComponentStore } from './notifications-table.component-store';
import { AppDatePipe } from '../../pipes/app-date.pipe';

@Component({
  selector: 'app-notifications-table[entityUuid][ownerResourceType][hasModifyPermission]',
  templateUrl: './notifications-table.component.html',
  styleUrls: ['./notifications-table.component.scss'],
  providers: [NotificationsTableComponentStore],
})
export class NotificationsTableComponent extends BaseComponent implements OnInit {
  @Input() entityUuid!: string;
  @Input() ownerResourceType!: NotificationEntityType;
  @Input() hasModifyPermission!: Observable<boolean>;

  public rolesOptions$: Observable<APIRegularOptionResponseDTO[]> | undefined = undefined;
  public readonly notifications$ = this.componentStore.notifications$;
  public readonly isLoading$ = this.componentStore.notificationsLoading$;
  public readonly anyNotifications$ = this.notifications$.pipe(matchEmptyArray(), invertBooleanValue());
  public readonly nullPlaceholder = '---';
  public readonly notificationTypeOptions = notificationTypeOptions;
  public readonly notificationTypeRepeat = this.notificationTypeOptions[1];

  constructor(
    private readonly componentStore: NotificationsTableComponentStore,
    private readonly confirmationService: ConfirmActionService,
    private readonly notificationService: NotificationService,
    private readonly notificationDialog: MatDialog,
    private readonly notificationViewSentDialog: MatDialog,
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly appDatePipe: AppDatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    const optionType = this.getRolesOptionType();
    if (optionType) {
      this.store.dispatch(RoleOptionTypeActions.getOptions(optionType));
    }
    this.getNotifications();

    this.subscriptions.add(
      this.actions$.pipe(ofType(UserNotificationActions.notificationCreated)).subscribe((_) => {
        this.getNotifications();
      })
    );
  }

  public formatDate(date: string | undefined) {
    if (date) return this.appDatePipe.transform(date);
    return this.nullPlaceholder;
  }

  public onDeactivate(notification: APINotificationResponseDTO) {
    this.confirmationService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på at du vil deaktivere ${this.getSpecificNotificationWarning(
        notification.name
      )}?`,
      onConfirm: () => {
        if (notification.uuid) {
          this.componentStore.deactivateNotification({
            ownerResourceType: this.ownerResourceType,
            notificationUuid: notification.uuid,
            ownerResourceUuid: this.entityUuid,
            onComplete: () => this.getNotifications(),
          });
        } else {
          this.notificationService.showError($localize`Fejl: kan ikke deaktivere en advis uden uuid.`);
        }
      },
    });
  }

  public onRemove(notification: APINotificationResponseDTO) {
    this.confirmationService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på at du vil fjerne ${this.getSpecificNotificationWarning(notification.name)}?`,
      onConfirm: () => {
        if (notification.uuid) {
          this.componentStore.deleteNotification({
            ownerResourceType: this.ownerResourceType,
            notificationUuid: notification.uuid,
            ownerResourceUuid: this.entityUuid,
            onComplete: () => this.getNotifications(),
          });
        } else {
          this.notificationService.showError($localize`Fejl: kan ikke slette en advis uden uuid.`);
        }
      },
    });
  }

  public onClickViewSent(notification: APINotificationResponseDTO) {
    const dialogRef = this.notificationViewSentDialog.open(NotificationsTableSentDialogComponent, {
      data: notification,
    });
    const componentInstance = dialogRef.componentInstance;
    componentInstance.title = $localize`Sendte advis`;
    componentInstance.ownerEntityUuid = this.entityUuid;
  }

  public onClickEdit(notification: APINotificationResponseDTO) {
    this.rolesOptions$ = this.getRolesOptionTypes();
    this.subscriptions.add(
      this.rolesOptions$.subscribe((options) => {
        const dialogRef = this.openNotificationsTableDialog();
        const componentInstance = dialogRef.componentInstance;
        componentInstance.notification = notification;
        this.setupDialogDefaults(componentInstance, options);
        (componentInstance.title = $localize`Redigér advis`), (componentInstance.confirmText = $localize`Gem`);
      })
    );
  }

  public onCreate() {
    this.rolesOptions$ = this.getRolesOptionTypes();
    this.subscriptions.add(
      this.rolesOptions$.subscribe((options) => {
        const dialogRef = this.openNotificationsTableDialog();
        const componentInstance = dialogRef.componentInstance;
        this.setupDialogDefaults(componentInstance, options);
        (componentInstance.title = $localize`Tilføj advis`), (componentInstance.confirmText = $localize`Tilføj`);
      })
    );
  }

  public getCommaSeparatedRecipients(
    emailRecipients: APIEmailRecipientResponseDTO[] | undefined,
    roleRecipients: APIRoleRecipientResponseDTO[] | undefined
  ) {
    const emailRecipientEmails = emailRecipients?.map((recipient) => recipient.email);
    const roleRecipientNames = roleRecipients?.map((recipient) => recipient.role?.name);
    return emailRecipientEmails?.concat(roleRecipientNames).join(', ');
  }

  public onDialogActionComplete() {
    this.store.dispatch(UserNotificationActions.notificationCreated(this.ownerResourceType));
    this.getNotifications();
    this.notificationDialog.closeAll();
  }

  private getRolesOptionTypes() {
    const option = this.getRolesOptionType();
    if (!option) return new Observable<APIRoleOptionResponseDTO[]>();
    return this.store.select(selectRoleOptionTypes(option)).pipe(
      filterNullish(),
      map((options) => options.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  private getRolesOptionType(): RoleOptionTypes | undefined {
    switch (this.ownerResourceType) {
      case NotificationEntityTypeEnum.ItSystemUsage:
        return 'it-system-usage';
      case NotificationEntityTypeEnum.ItContract:
        return 'it-contract';
      case NotificationEntityTypeEnum.DataProcessingRegistration:
        return 'data-processing';
      default:
        return undefined;
    }
  }

  private getNotifications() {
    this.componentStore.getNotificationsByEntityUuid({
      ownerResourceType: this.ownerResourceType,
      entityUuid: this.entityUuid,
    });
  }

  private openNotificationsTableDialog(config?: MatDialogConfig<unknown> | undefined) {
    const paddedConfig: MatDialogConfig<unknown> = config ?? {};
    paddedConfig.height = '95%';
    paddedConfig.maxHeight = '750px';
    return this.notificationDialog.open(NotificationsTableDialogComponent, paddedConfig);
  }

  private setupDialogDefaults(
    componentInstance: NotificationsTableDialogComponent,
    options: APIRegularOptionResponseDTO[]
  ) {
    componentInstance.ownerEntityUuid = this.entityUuid;
    componentInstance.ownerResourceType = this.ownerResourceType;
    componentInstance.rolesOptions = options;
    componentInstance.notificationRepetitionFrequencyOptions = notificationRepetitionFrequencyOptions;
  }

  private getSpecificNotificationWarning(name: string | undefined): string {
    return name ? $localize`advisen "${name}"` : $localize`denne advis`;
  }
}
