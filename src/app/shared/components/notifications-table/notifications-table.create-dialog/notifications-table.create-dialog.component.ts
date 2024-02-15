import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { APIBaseNotificationPropertiesWriteRequestDTO, APIRegularOptionResponseDTO, APIRoleRecipientWriteRequestDTO } from 'src/app/api/v2';
import { checkboxesCheckedValidator, dateGreaterThanControlValidator, dateLessThanOrEqualToDateValidator } from 'src/app/shared/helpers/form.helpers';
import { NotificationRepetitionFrequency } from 'src/app/shared/models/notification-repetition-frequency.model';
import { NotificationType, notificationTypeOptions } from 'src/app/shared/models/notification-type.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NotificationsTableComponentStore } from '../notifications-table.component-store';

@Component({
  selector: 'app-notifications-table.create-dialog',
  templateUrl: './notifications-table.create-dialog.component.html',
  styleUrl: './notifications-table.create-dialog.component.scss',
  providers: [NotificationsTableComponentStore]
})
export class NotificationsTableCreateDialogComponent implements OnInit {
  @Input() public title!: string;
  @Input() public systemUsageRolesOptions!: Array<APIRegularOptionResponseDTO>;
  @Input() public notificationRepetitionFrequencyOptions!: Array<NotificationRepetitionFrequency>;
  @Input() public ownerEntityUuid!: string;
  @Input() public organizationUuid!: string;

  public readonly notificationForm = new FormGroup({
    emailRecipientControl: new FormControl<string | undefined>(undefined, Validators.email),
    emailCcControl: new FormControl<string | undefined>(undefined, Validators.email),
    subjectControl: new FormControl<string | undefined>(undefined, Validators.required),
    notificationTypeControl: new FormControl<NotificationType | undefined>(undefined, Validators.required),
    nameControl: new FormControl<string | undefined>(undefined),
    repetitionControl: new FormControl<NotificationRepetitionFrequency | undefined>(undefined, Validators.required),
    fromDateControl: new FormControl<Date | undefined>(undefined, Validators.required),
    toDateControl: new FormControl<Date | undefined>(undefined),
    bodyControl: new FormControl<string | undefined>(undefined)
  });

  public readonly roleRecipientsForm = new FormGroup({}, checkboxesCheckedValidator());
  public readonly roleCcsForm = new FormGroup({});

  public readonly notificationTypeOptions = notificationTypeOptions;
  public readonly notificationTypeRepeat = this.notificationTypeOptions[1];

  public showDateOver28Tooltip: boolean = false;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly dialogRef: MatDialogRef<NotificationsTableCreateDialogComponent>,
    private readonly componentStore: NotificationsTableComponentStore) {}

  ngOnInit(): void {
    this.setupNotificationControls();
    this.setupRecipientControls();
  }

  private setupNotificationControls(){
    const notificationControls = this.notificationForm.controls;
    notificationControls.fromDateControl.validator = dateLessThanOrEqualToDateValidator(new Date());
    notificationControls.toDateControl.validator = dateGreaterThanControlValidator(this.notificationForm.controls.fromDateControl);
    notificationControls.fromDateControl.valueChanges.subscribe(() =>
      this.toggleShowDateOver28Tooltip());
    notificationControls.repetitionControl.valueChanges.subscribe(() =>
      this.toggleShowDateOver28Tooltip());
  }

  private setupRecipientControls(){
    this.systemUsageRolesOptions.forEach((option) => {
      this.roleRecipientsForm.addControl(option.uuid, new FormControl<boolean>(false));
      this.roleCcsForm.addControl(option.uuid, new FormControl<boolean>(false));
    })
    this.toggleRepetitionFields(false);
  }

  private toggleShowDateOver28Tooltip() {
    const notificationControls = this.notificationForm.controls;
    const fromDate = notificationControls.fromDateControl.value;
    if (fromDate){
      const dayOfMonth = new Date(fromDate).getDate();
      const repetition = notificationControls.repetitionControl.value;
      const repetitionIsMonthOrMore =
      this.notificationRepetitionFrequencyOptions.findIndex((option) => option.value === repetition?.value)
        > 2;

      this.showDateOver28Tooltip = dayOfMonth > 28 && repetitionIsMonthOrMore;
    }
  }

  public changeNotificationType(newValue: string, valueChange?: ValidatedValueChange<unknown>) {
    if (valueChange && !valueChange.valid) {
      this.notificationService.showError($localize`"${valueChange.text}" er ugyldig`);
    } else {
        this.toggleRepetitionFields(newValue === this.notificationTypeRepeat.value)
    }
  }

  public onCancel() {
    this.dialogRef.close();
  }

  public onSave() {
    if (!this.notificationForm.valid || !this.roleRecipientsForm.valid || !this.roleCcsForm.valid) return;
    const notificationControls = this.notificationForm.controls;
    const subject = notificationControls.subjectControl.value;
    const body = notificationControls.bodyControl.value;
    const roleRecipients: APIRoleRecipientWriteRequestDTO[] = [];
    for (const controlKey in this.roleRecipientsForm.controls) {
      const control = this.roleRecipientsForm.get(controlKey);
      if (control?.value) roleRecipients.push({roleUuid: controlKey})
    }
    //todo add email recipeitns here and in dto below

    const roleCcs: APIRoleRecipientWriteRequestDTO[] = [];
    for (const controlKey in this.roleCcsForm.controls) {
      const control = this.roleCcsForm.get(controlKey);
      if (control?.value) roleCcs.push({roleUuid: controlKey})
    }
    //todo add email ccs here and in dto below

    if (subject && roleRecipients){
      const basePropertiesDto: APIBaseNotificationPropertiesWriteRequestDTO =  {
        subject: subject,
        body: body ?? '',
        receivers: {
          roleRecipients: roleRecipients,
          emailRecipients: []
        },
        ccs: {
          roleRecipients: roleCcs,
          emailRecipients: []
        }
      }

      const notificationType = this.notificationForm.controls.notificationTypeControl.value
      if (notificationType === this.notificationTypeRepeat){
        //todo add schedule info and post as scheduled
        const name = notificationControls.nameControl.value;
        const fromDate = notificationControls.fromDateControl.value?.toISOString();
        const toDate = notificationControls.toDateControl.value?.toISOString();
        const repetitionFrequency = notificationControls.repetitionControl.value?.value;
        if (fromDate && repetitionFrequency){
          this.componentStore.postScheduledNotification({
          ownerResourceUuid: this.ownerEntityUuid,
          organizationUuid: this.organizationUuid,
          requestBody: {
            baseProperties: basePropertiesDto,
            name: name ?? undefined,
            fromDate: fromDate,
            toDate: toDate ?? undefined,
            repetitionFrequency: repetitionFrequency
          },
        })
        }

      } else
      {
        this.componentStore.postImmediateNotification({
        ownerResourceUuid: this.ownerEntityUuid,
        organizationUuid: this.organizationUuid,
        requestBody: {
          baseProperties: basePropertiesDto
        },
      })
      }
    }
    this.dialogRef.close();
  }

  private toggleRepetitionFields(isRepeated: boolean) {
    const allControls = this.notificationForm.controls;
    const toBeToggled = [allControls.nameControl,
      allControls.repetitionControl,
      allControls.fromDateControl,
      allControls.toDateControl]
    if (isRepeated) {
      toBeToggled.forEach((control) => control.enable());
    } else {
      toBeToggled.forEach((control) => control.disable());
    }
  }
}
