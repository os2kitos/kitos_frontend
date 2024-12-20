import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  APIBaseNotificationPropertiesWriteRequestDTO,
  APIEmailRecipientWriteRequestDTO,
  APINotificationResponseDTO,
  APIRegularOptionResponseDTO,
  APIScheduledNotificationWriteRequestDTO,
} from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { EMAIL_REGEX_PATTERN } from 'src/app/shared/constants/constants';
import {
  dateGreaterThanOrEqualControlValidator,
  dateGreaterThanOrEqualToDateValidator,
} from 'src/app/shared/helpers/form.helpers';
import {
  MultiSelectDropdownItem,
  mapEmailOptionToMultiSelectItem,
  mapRegularOptionToMultiSelectItem,
  mapRoleOptionToMultiSelectItem,
} from 'src/app/shared/models/dropdown-option.model';
import { NotificationEntityType } from 'src/app/shared/models/notification-entity-types';
import {
  NotificationRepetitionFrequency,
  mapNotificationRepetitionFrequency,
} from 'src/app/shared/models/notification-repetition-frequency.model';
import {
  NotificationType,
  mapNotificationType,
  notificationTypeOptions,
} from 'src/app/shared/models/notification-type.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { AppRootUrlResolverService } from 'src/app/shared/services/app-root-url-resolver.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserNotificationActions } from 'src/app/store/user-notifications/actions';
import { NotificationsTableComponentStore } from '../notifications-table.component-store';

@Component({
  selector: 'app-notifications-table-dialog',
  templateUrl: './notifications-table-dialog.component.html',
  styleUrl: './notifications-table-dialog.component.scss',
  providers: [NotificationsTableComponentStore],
})
export class NotificationsTableDialogComponent extends BaseComponent implements OnInit {
  @Input() public title!: string;
  @Input() public rolesOptions!: Array<APIRegularOptionResponseDTO>;
  @Input() public notificationRepetitionFrequencyOptions!: Array<NotificationRepetitionFrequency>;
  @Input() public ownerEntityUuid!: string;
  @Input() public ownerResourceType!: NotificationEntityType;
  @Input() public confirmText!: string;
  @Input() public notification: APINotificationResponseDTO | undefined;

  public readonly isSaving$ = this.componentStore.isSaving$;

  public receiverOptions: MultiSelectDropdownItem<string>[] = [];
  public ccOptions: MultiSelectDropdownItem<string>[] = [];

  public initialSelectedReceiverValues: MultiSelectDropdownItem<string>[] = [];
  public initialSelectedCcValues: MultiSelectDropdownItem<string>[] = [];

  public isRepeated: boolean = false;

  public readonly notificationForm = new FormGroup({
    subjectControl: new FormControl<string | undefined>(undefined, Validators.required),
    notificationTypeControl: new FormControl<NotificationType | undefined>(undefined, Validators.required),
    receivers: new FormControl<string[] | undefined>(undefined, Validators.required),
    ccs: new FormControl<string[] | undefined>(undefined),
    nameControl: new FormControl<string | undefined>(undefined),
    repetitionControl: new FormControl<NotificationRepetitionFrequency | undefined>(undefined),
    fromDateControl: new FormControl<Date | undefined>(undefined),
    toDateControl: new FormControl<Date | undefined>(undefined),
    bodyControl: new FormControl<string | undefined>(undefined, Validators.required),
  });

  public readonly notificationTypeOptions = notificationTypeOptions;
  public readonly notificationTypeImmediate = this.notificationTypeOptions[0];
  public readonly notificationTypeRepeat = this.notificationTypeOptions[1];

  public showDateOver28Tooltip: boolean = false;
  public currentNotificationSent$ = this.componentStore.currentNotificationSent$;

  public rootUrl: string;
  public canEdit = true;
  private isEdit = false;

  constructor(
    private readonly appRootUrlResolverService: AppRootUrlResolverService,
    private readonly notificationService: NotificationService,
    private readonly dialogRef: MatDialogRef<NotificationsTableDialogComponent>,
    private readonly componentStore: NotificationsTableComponentStore,
    private readonly store: Store
  ) {
    super();
    this.rootUrl = this.appRootUrlResolverService.resolveRootUrl();
  }

  ngOnInit(): void {
    this.receiverOptions = this.rolesOptions.map((option: APIRegularOptionResponseDTO) =>
      mapRegularOptionToMultiSelectItem(option)
    );
    this.ccOptions = this.rolesOptions.map((option: APIRegularOptionResponseDTO) =>
      mapRegularOptionToMultiSelectItem(option)
    );

    this.setupNotificationControls();
    this.setupDisabledStateAndValidators();

    if (this.notification) {
      this.isEdit = true;

      if (!this.notification?.active) {
        this.canEdit = false;
        this.disableForms();
      }
    }
  }

  public receipientsChanged(roles: string[], isReceivers: boolean): void {
    this.getReceipientsControl(isReceivers).setValue(roles);
  }

  public receipientsCleared(isReceivers: boolean): void {
    this.getReceipientsControl(isReceivers).setValue([]);
  }

  public receipientsAdded(receipient: MultiSelectDropdownItem<string>, isReceivers: boolean): void {
    this.getReceipientsControl(isReceivers).value.push(receipient.value);
  }

  public hasImmediateNotification = () =>
    this.notification && this.notification.notificationType !== this.notificationTypeRepeat.value;

  public onCancel() {
    this.dialogRef.close();
  }

  public changeNotificationType(newValue: string, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
      this.toggleRepetitionFields(newValue === this.notificationTypeRepeat.value);
    }
  }

  public repeatIsSelected() {
    return this.notificationForm.controls.notificationTypeControl.value === this.notificationTypeRepeat;
  }

  public handleClickConfirm() {
    const basePropertiesDto = this.getBasePropertiesDto(this.notificationForm);
    if (!basePropertiesDto) return;

    const notificationType = this.notificationForm.controls['notificationTypeControl'].value;
    let scheduledNotificationDto = undefined;
    if (notificationType === this.notificationTypeRepeat) {
      scheduledNotificationDto = this.getScheduledNotificationDTO(basePropertiesDto, this.notificationForm);
    }

    if (this.isEdit) {
      this.onEdit(scheduledNotificationDto);
    } else {
      this.onCreate(basePropertiesDto, scheduledNotificationDto);
    }
  }

  private onEdit(scheduledNotificationDto?: APIScheduledNotificationWriteRequestDTO) {
    const notificationUuid = this.notification?.uuid;
    if (notificationUuid) {
      if (scheduledNotificationDto) {
        this.componentStore.putScheduledNotification({
          ownerResourceType: this.ownerResourceType,
          ownerResourceUuid: this.ownerEntityUuid,
          notificationUuid: notificationUuid,
          requestBody: scheduledNotificationDto,
          onComplete: () => this.onDialogActionComplete(),
        });
      }
    }
  }

  private onCreate(
    basePropertiesDto: APIBaseNotificationPropertiesWriteRequestDTO,
    scheduledNotificationDto?: APIScheduledNotificationWriteRequestDTO
  ) {
    if (scheduledNotificationDto) {
      this.saveScheduledNotification(scheduledNotificationDto);
    } else {
      this.saveImmediateNotification(basePropertiesDto);
    }
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

  private getBasePropertiesDto(notificationForm: FormGroup): APIBaseNotificationPropertiesWriteRequestDTO | undefined {
    const notificationControls = notificationForm.controls;
    const subject = notificationControls['subjectControl'].value;
    const body = notificationControls['bodyControl'].value;

    const receivers = notificationControls['receivers'].value;
    const ccs = notificationControls['ccs'].value;

    const mappedReceivers = this.getEmailAndRoleRecipients(receivers);
    const mappedCcs = this.getEmailAndRoleRecipients(ccs);

    const emailReceivers = mappedReceivers.emailRecipients;
    const roleReceivers = mappedReceivers.roleRecipients;
    const emailCcs = mappedCcs.emailRecipients;
    const roleCcs = mappedCcs.roleRecipients;

    if (subject && body && (roleReceivers.length > 0 || emailReceivers.length > 0)) {
      return {
        subject: subject,
        body: body,
        receivers: {
          roleRecipients: roleReceivers,
          emailRecipients: emailReceivers,
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
      ownerResourceUuid: this.ownerEntityUuid,
      requestBody: scheduledNotificationDto,
      onComplete: () => this.onDialogActionComplete(),
    });
  }

  private saveImmediateNotification(basePropertiesDto: APIBaseNotificationPropertiesWriteRequestDTO) {
    this.componentStore.postImmediateNotification({
      ownerResourceType: this.ownerResourceType,
      ownerResourceUuid: this.ownerEntityUuid,
      requestBody: {
        baseProperties: basePropertiesDto,
      },
      onComplete: () => this.onDialogActionComplete(),
    });
  }

  private getReceipientsControl(isReceivers: boolean): FormControl {
    return isReceivers ? this.notificationForm.controls.receivers : this.notificationForm.controls.ccs;
  }

  private getEmailAndRoleRecipients(recipients: string[] | undefined) {
    const emailRecipients: APIEmailRecipientWriteRequestDTO[] = [];
    const roleRecipients: { roleUuid: string }[] = [];

    if (!recipients) return { emailRecipients, roleRecipients };

    recipients.forEach((recipient) => {
      if (EMAIL_REGEX_PATTERN.test(recipient)) {
        emailRecipients.push({ email: recipient });
      } else {
        roleRecipients.push({ roleUuid: recipient });
      }
    });

    return { emailRecipients, roleRecipients };
  }

  private setupNotificationControls() {
    const notificationControls = this.notificationForm.controls;

    this.subscriptions.add(
      notificationControls.fromDateControl.valueChanges.subscribe(() => {
        this.toggleShowDateOver28Tooltip();
        this.notificationForm.controls.toDateControl.updateValueAndValidity();
      })
    );
    this.subscriptions.add(
      notificationControls.repetitionControl.valueChanges.subscribe(() => this.toggleShowDateOver28Tooltip())
    );
    notificationControls.toDateControl.validator = dateGreaterThanOrEqualControlValidator(
      this.notificationForm.controls.fromDateControl
    );

    if (this.notification) {
      const fromDate = this.notification.fromDate;
      if (fromDate) notificationControls.fromDateControl.setValue(new Date(fromDate));
      const toDate = this.notification.toDate;
      if (toDate) notificationControls.toDateControl.setValue(new Date(toDate));
      notificationControls.subjectControl.setValue(this.notification.subject);
      notificationControls.nameControl.setValue(this.notification.name);
      notificationControls.bodyControl.setValue(this.notification.body);
      notificationControls.notificationTypeControl.setValue(mapNotificationType(this.notification.notificationType));
      notificationControls.repetitionControl.setValue(
        mapNotificationRepetitionFrequency(this.notification.repetitionFrequency)
      );

      const emailRecipientsSet = new Set(
        this.notification.receivers?.emailRecipients?.map((option) => mapEmailOptionToMultiSelectItem(option, true)) ??
          []
      );
      const roleRecipientsSet = new Set(
        this.notification.receivers?.roleRecipients?.map((option) => mapRoleOptionToMultiSelectItem(option, true)) ?? []
      );
      const emailCcsSet = new Set(
        this.notification.cCs?.emailRecipients?.map((option) => mapEmailOptionToMultiSelectItem(option, true)) ?? []
      );
      const roleCcsSet = new Set(
        this.notification.cCs?.roleRecipients?.map((option) => mapRoleOptionToMultiSelectItem(option, true)) ?? []
      );

      this.receiverOptions = Array.from(new Set([...this.receiverOptions, ...emailRecipientsSet]));
      this.ccOptions = Array.from(new Set([...this.ccOptions, ...emailCcsSet]));

      this.updateSelectedRoles(roleRecipientsSet, this.receiverOptions);
      this.updateSelectedRoles(roleCcsSet, this.ccOptions);

      this.initialSelectedReceiverValues = this.receiverOptions.filter((option) => option.selected);
      this.initialSelectedCcValues = this.ccOptions.filter((option) => option.selected);

      notificationControls.receivers.setValue(this.initialSelectedReceiverValues.map((option) => option.value));
      notificationControls.ccs.setValue(this.initialSelectedCcValues.map((option) => option.value));
    } else {
      // 20240528: HACK: Validation behaviour should be determined by permissions instead
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      notificationControls.fromDateControl.addValidators(dateGreaterThanOrEqualToDateValidator(today));
      notificationControls.fromDateControl.updateValueAndValidity();
    }
  }

  private setupDisabledStateAndValidators() {
    if (this.hasImmediateNotification()) {
      this.canEdit = false;
      this.disableForms();
    }

    if (this.notification && this.notification.notificationType === this.notificationTypeRepeat.value) {
      this.toggleRepetitionFields(true);
      this.notificationForm.controls.notificationTypeControl.disable();
      this.notificationForm.controls.repetitionControl.disable();
      this.notificationForm.controls.fromDateControl.disable();
      this.notificationForm.controls.fromDateControl.setValidators([]);
    } else {
      this.toggleRepetitionFields(false);
      const notificationControls = this.notificationForm.controls;
      notificationControls.notificationTypeControl.setValue(mapNotificationType(this.notificationTypeImmediate.value));
    }
  }

  private toggleRepetitionFields(isRepeated: boolean) {
    this.isRepeated = isRepeated;

    if (isRepeated) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      this.notificationForm.controls.repetitionControl.setValidators([Validators.required]);
      this.notificationForm.controls.fromDateControl.setValidators([
        Validators.required,
        dateGreaterThanOrEqualToDateValidator(today),
      ]);
    } else {
      this.notificationForm.controls.repetitionControl.setValidators([]);
      this.notificationForm.controls.fromDateControl.setValidators([]);
      this.notificationForm.controls.fromDateControl.patchValue(undefined);
      this.notificationForm.controls.toDateControl.patchValue(undefined);
    }
  }

  private toggleShowDateOver28Tooltip() {
    const notificationControls = this.notificationForm.controls;
    const fromDate = notificationControls.fromDateControl.value;
    if (fromDate) {
      const dayOfMonth = new Date(fromDate).getDate();
      const repetition = notificationControls.repetitionControl.value;
      const repetitionIsMonthOrMore =
        this.notificationRepetitionFrequencyOptions.findIndex((option) => option.value === repetition?.value) > 2;

      this.showDateOver28Tooltip = dayOfMonth > 28 && repetitionIsMonthOrMore;
    }
  }

  private disableForms() {
    this.notificationForm.disable();
  }

  private onDialogActionComplete() {
    this.store.dispatch(UserNotificationActions.notificationCreated(this.ownerResourceType));
    this.onCancel();
  }

  private updateSelectedRoles(set: Set<MultiSelectDropdownItem<string>>, options: MultiSelectDropdownItem<string>[]) {
    set.forEach((item) => {
      const option = options.find((option) => option.value === item.value);
      if (option) option.selected = true;
    });
  }
}
