import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import {
  APIBaseNotificationPropertiesWriteRequestDTO,
  APIEmailRecipientResponseDTO,
  APINotificationResponseDTO,
  APIRegularOptionResponseDTO,
  APIRoleOptionResponseDTO,
  APIRoleRecipientResponseDTO,
  APIRoleRecipientWriteRequestDTO,
  APIScheduledNotificationWriteRequestDTO,
} from 'src/app/api/v2';
import { RoleOptionTypeActions } from 'src/app/store/roles-option-type-store/actions';
import { selectRoleOptionTypes } from 'src/app/store/roles-option-type-store/selectors';
import { BaseComponent } from '../../base/base.component';
import { NOTIFICATIONS_DIALOG_DEFAULT_HEIGHT, NOTIFICATIONS_DIALOG_DEFAULT_WIDTH } from '../../constants/constants';
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
    private readonly store: Store
  ) {
    super();
  }

  ngOnInit(): void {
    const optionType = this.getRolesOptionType();
    if (optionType) {
      this.store.dispatch(RoleOptionTypeActions.getOptions(optionType));
    }
    this.getNotifications();
  }

  public formatDate(date: string | undefined) {
    if (date) return new Date(date).toLocaleDateString();
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
        const dialogRef = this.openNotificationsTableDialog({ data: notification });
        const componentInstance = dialogRef.componentInstance;
        this.setupDialogDefaults(componentInstance, options);
        (componentInstance.title = $localize`Redigér advis`), (componentInstance.confirmText = $localize`Gem`);
        componentInstance.onConfirm = () =>
          this.onEdit(
            componentInstance.notificationForm,
            componentInstance.roleRecipientsForm,
            componentInstance.roleCcsForm,
            componentInstance.emailRecipientsFormArray,
            componentInstance.emailCcsFormArray,
            componentInstance.notification?.uuid
          );
      })
    );
  }

  public onEdit(
    notificationForm: FormGroup,
    roleRecipientsForm: FormGroup,
    roleCcsForm: FormGroup,
    emailRecipientsFormArray: FormArray,
    emailCcsFormArray: FormArray,
    notificationUuid: string | undefined
  ) {
    const basePropertiesDto = this.getBasePropertiesDto(
      notificationForm,
      roleRecipientsForm,
      roleCcsForm,
      emailRecipientsFormArray,
      emailCcsFormArray
    );
    if (basePropertiesDto && notificationUuid) {
      const notificationControls = notificationForm.controls;
      const notificationType = notificationControls['notificationTypeControl'].value;
      if (notificationType === this.notificationTypeRepeat) {
        const scheduledNotificationDto = this.getScheduledNotificationDTO(basePropertiesDto, notificationForm);
        if (scheduledNotificationDto) {
          this.componentStore.putScheduledNotification({
            ownerResourceType: this.ownerResourceType,
            ownerResourceUuid: this.entityUuid,
            notificationUuid: notificationUuid,
            requestBody: scheduledNotificationDto,
            onComplete: () => this.onDialogActionComplete(),
          });
        }
      }
    }
  }

  public onCreate() {
    this.rolesOptions$ = this.getRolesOptionTypes();
    this.subscriptions.add(
      this.rolesOptions$.subscribe((options) => {
        const dialogRef = this.openNotificationsTableDialog();
        const componentInstance = dialogRef.componentInstance;
        this.setupDialogDefaults(componentInstance, options);
        (componentInstance.title = $localize`Tilføj advis`), (componentInstance.confirmText = $localize`Tilføj`);
        componentInstance.onConfirm = () =>
          this.save(
            componentInstance.notificationForm,
            componentInstance.roleRecipientsForm,
            componentInstance.roleCcsForm,
            componentInstance.emailRecipientsFormArray,
            componentInstance.emailCcsFormArray
          );
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
    this.getNotifications();
    this.notificationDialog.closeAll();
  }

  private save(
    notificationForm: FormGroup,
    roleRecipientsForm: FormGroup,
    roleCcsForm: FormGroup,
    emailRecipientsFormArray: FormArray,
    emailCcsFormArray: FormArray
  ) {
    const basePropertiesDto = this.getBasePropertiesDto(
      notificationForm,
      roleRecipientsForm,
      roleCcsForm,
      emailRecipientsFormArray,
      emailCcsFormArray
    );
    if (basePropertiesDto) {
      const notificationType = notificationForm.controls['notificationTypeControl'].value;
      if (notificationType === this.notificationTypeRepeat) {
        const scheduledNotificationDto = this.getScheduledNotificationDTO(basePropertiesDto, notificationForm);
        if (scheduledNotificationDto) this.saveScheduledNotification(scheduledNotificationDto);
      } else this.saveImmediateNotification(basePropertiesDto);
    }
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
    paddedConfig.width = `${NOTIFICATIONS_DIALOG_DEFAULT_WIDTH}px`;
    paddedConfig.height = `${NOTIFICATIONS_DIALOG_DEFAULT_HEIGHT}px`;
    return this.notificationDialog.open(NotificationsTableDialogComponent, paddedConfig);
  }

  private setupDialogDefaults(
    componentInstance: NotificationsTableDialogComponent,
    options: APIRegularOptionResponseDTO[]
  ) {
    componentInstance.ownerEntityUuid = this.entityUuid;
    componentInstance.rolesOptions = options;
    componentInstance.notificationRepetitionFrequencyOptions = notificationRepetitionFrequencyOptions;
  }

  private getScheduledNotificationDTO(
    basePropertiesDto: APIBaseNotificationPropertiesWriteRequestDTO,
    notificationForm: FormGroup
  ): APIScheduledNotificationWriteRequestDTO | undefined {
    const notificationControls = notificationForm.controls;
    const name = notificationControls['nameControl'].value;
    const fromDate = notificationControls['fromDateControl'].value;
    const toDate = notificationControls['toDateControl'].value;
    const repetitionFrequency = notificationControls['repetitionControl'].value?.value;
    if (fromDate && repetitionFrequency) {
      return {
        baseProperties: basePropertiesDto,
        name: name ?? undefined,
        fromDate: fromDate,
        toDate: toDate ?? undefined,
        repetitionFrequency: repetitionFrequency,
      };
    }
    return undefined;
  }

  private getBasePropertiesDto(
    notificationForm: FormGroup,
    roleRecipientsForm: FormGroup,
    roleCcsForm: FormGroup,
    emailRecipientsFormArray: FormArray,
    emailCcsFormArray: FormArray
  ): APIBaseNotificationPropertiesWriteRequestDTO | undefined {
    const notificationControls = notificationForm.controls;
    const subject = notificationControls['subjectControl'].value;
    const body = notificationControls['bodyControl'].value;

    const roleRecipients = this.getRecipientDtosFromCheckboxes(roleRecipientsForm);
    const emailRecipients = emailRecipientsFormArray.controls
      .filter((control) => this.valueIsNotEmptyString(control.value))
      .map((control) => {
        return { email: control.value };
      });

    const roleCcs = this.getRecipientDtosFromCheckboxes(roleCcsForm);
    const emailCcs = emailCcsFormArray.controls
      .filter((control) => this.valueIsNotEmptyString(control.value))
      .map((control) => {
        return { email: control.value };
      });

    if (subject && body && (roleRecipients.length > 0 || emailRecipients.length > 0)) {
      return {
        subject: subject,
        body: body,
        receivers: {
          roleRecipients: roleRecipients,
          emailRecipients: emailRecipients,
        },
        ccs: {
          roleRecipients: roleCcs,
          emailRecipients: emailCcs,
        },
      };
    }
    return undefined;
  }

  private saveScheduledNotification(scheduledNotificationDto: APIScheduledNotificationWriteRequestDTO) {
    this.componentStore.postScheduledNotification({
      ownerResourceType: this.ownerResourceType,
      ownerResourceUuid: this.entityUuid,
      requestBody: scheduledNotificationDto,
      onComplete: () => this.onDialogActionComplete(),
    });
  }

  private saveImmediateNotification(basePropertiesDto: APIBaseNotificationPropertiesWriteRequestDTO) {
    this.componentStore.postImmediateNotification({
      ownerResourceType: this.ownerResourceType,
      ownerResourceUuid: this.entityUuid,
      requestBody: {
        baseProperties: basePropertiesDto,
      },
      onComplete: () => this.onDialogActionComplete(),
    });
  }

  private getRecipientDtosFromCheckboxes(form: FormGroup) {
    const recipients: APIRoleRecipientWriteRequestDTO[] = [];
    for (const controlKey in form.controls) {
      const control = form.get(controlKey);
      if (control?.value) recipients.push({ roleUuid: controlKey });
    }
    return recipients;
  }

  private valueIsNotEmptyString(value: string | undefined) {
    return value && value.trim() !== '';
  }

  private getSpecificNotificationWarning(name: string | undefined): string {
    return name ? $localize`advisen "${name}"` : $localize`denne advis`;
  }
}
