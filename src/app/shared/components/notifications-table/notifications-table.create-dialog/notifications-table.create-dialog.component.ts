import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { APIBaseNotificationPropertiesWriteRequestDTO, APIEmailRecipientResponseDTO, APIRegularOptionResponseDTO, APIRoleRecipientWriteRequestDTO } from 'src/app/api/v2';
import { checkboxesCheckedValidator, dateGreaterThanControlValidator, dateLessThanOrEqualToDateValidator } from 'src/app/shared/helpers/form.helpers';
import { NotificationRepetitionFrequency } from 'src/app/shared/models/notification-repetition-frequency.model';
import { NotificationType, notificationTypeOptions } from 'src/app/shared/models/notification-type.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NotificationsTableComponentStore } from '../notifications-table.component-store';
import { distinctUntilChanged } from 'rxjs';

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
  @Input() public onCreateNotification!: () => void;

  public readonly notificationForm = new FormGroup({
    emailRecipientsFormArray: new FormArray([new FormControl<string | undefined>(undefined, Validators.email)]),
    emailCcsFormArray: new FormArray([new FormControl<string | undefined>(undefined, Validators.email)]),
    subjectControl: new FormControl<string | undefined>(undefined, Validators.required),
    notificationTypeControl: new FormControl<NotificationType | undefined>(undefined, Validators.required),
    nameControl: new FormControl<string | undefined>(undefined),
    repetitionControl: new FormControl<NotificationRepetitionFrequency | undefined>(undefined, Validators.required),
    fromDateControl: new FormControl<Date | undefined>(undefined, Validators.required),
    toDateControl: new FormControl<Date | undefined>(undefined),
    bodyControl: new FormControl<string | undefined>(undefined, Validators.required)
  });

  public readonly roleRecipientsForm = new FormGroup({}, checkboxesCheckedValidator());
  public readonly roleCcsForm = new FormGroup({});

  public readonly notificationTypeOptions = notificationTypeOptions;
  public readonly notificationTypeRepeat = this.notificationTypeOptions[1];

  public showDateOver28Tooltip: boolean = false;

  get emailRecipientsFormArray(): FormArray {
    return this.notificationForm.get('emailRecipientsFormArray') as FormArray;
  }

  get emailCcsFormArray(): FormArray {
    return this.notificationForm.get('emailCcsFormArray') as FormArray;
  }

  constructor(
    private readonly notificationService: NotificationService,
    private readonly dialogRef: MatDialogRef<NotificationsTableCreateDialogComponent>,
    private readonly componentStore: NotificationsTableComponentStore) {}

  ngOnInit(): void {
    this.setupNotificationControls();
    this.setupRecipientControls();
    this.setupRecipientFieldsRelationship();
  }

  private setupRecipientFieldsRelationship(){
    this.emailRecipientsFormArray.valueChanges
    .pipe(distinctUntilChanged((a, b) => this.compareAsJson(a, b)))
    .subscribe(arrayValue => {
      if (arrayValue.some((value: string) => value !== '')) this.roleRecipientsForm.clearValidators();
      else this.roleRecipientsForm.setValidators(checkboxesCheckedValidator());
      this.roleRecipientsForm.updateValueAndValidity();
    });
    this.roleRecipientsForm.valueChanges
      .pipe(distinctUntilChanged((a, b) => this.compareAsJson(a, b)))
      .subscribe(value => {
      if (value) this.emailRecipientsFormArray.controls.forEach((control => control.setValidators(Validators.email)));
      else this.emailRecipientsFormArray.controls.forEach((control => control.setValidators([Validators.email, Validators.required])));
      this.emailRecipientsFormArray.updateValueAndValidity();
    });
  }

  private setupNotificationControls(){
    const notificationControls = this.notificationForm.controls;
    notificationControls.fromDateControl.addValidators(dateLessThanOrEqualToDateValidator(new Date()));
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

    const roleRecipients = this.getRecipientDtosFromCheckboxes(this.roleRecipientsForm);
    const emailRecipients = this.emailRecipientsFormArray.controls
      .filter((control) => this.valueIsNotEmptyString(control.value))
      .map((control) => {return { email: control.value }});

    const roleCcs = this.getRecipientDtosFromCheckboxes(this.roleCcsForm);
    const emailCcs = this.emailCcsFormArray.controls
      .filter((control) => this.valueIsNotEmptyString(control.value))
      .map((control) => {return { email: control.value }});

    if (subject && body && (roleRecipients.length > 0 || emailRecipients.length > 0)){
      const basePropertiesDto: APIBaseNotificationPropertiesWriteRequestDTO =  {
        subject: subject,
        body: body,
        receivers: {
          roleRecipients: roleRecipients,
          emailRecipients: emailRecipients
        },
        ccs: {
          roleRecipients: roleCcs,
          emailRecipients: emailCcs
        }
      }

      const notificationType = notificationControls.notificationTypeControl.value;
      if (notificationType === this.notificationTypeRepeat) this.postScheduledNotification(basePropertiesDto);
      else this.postImmediateNotification(basePropertiesDto);
    }
  }

  private onAddEmailRecipientField(){
    this.emailRecipientsFormArray.controls.push(new FormControl<string | undefined>(undefined, Validators.email));
  }

  private onAddEmailCCField(){
    this.emailCcsFormArray.controls.push(new FormControl<string | undefined>(undefined, Validators.email));
  }

  private onRemoveEmailRecipientField(index: number){
    console.log('here')
    if (this.emailRecipientsFormArray.controls.length > 1){
      this.emailRecipientsFormArray.controls.splice(index, 1);
    }
  }

  private valueIsNotEmptyString(value: string | undefined){
    return value && value.trim() !== '';
  }

  private compareAsJson = (a: unknown, b: unknown): boolean =>
    JSON.stringify(a) === JSON.stringify(b)

  private postScheduledNotification(basePropertiesDto: APIBaseNotificationPropertiesWriteRequestDTO){
    const notificationControls = this.notificationForm.controls;
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
      onComplete: () => this.onComplete()
    })
    }
  }

  private postImmediateNotification(basePropertiesDto: APIBaseNotificationPropertiesWriteRequestDTO){
    this.componentStore.postImmediateNotification({
      ownerResourceUuid: this.ownerEntityUuid,
      organizationUuid: this.organizationUuid,
      requestBody: {
        baseProperties: basePropertiesDto
      },
      onComplete: () => this.onComplete()
    })
  }

  private getRecipientDtosFromCheckboxes(form: FormGroup){
    const recipients: APIRoleRecipientWriteRequestDTO[] = [];
    for (const controlKey in form.controls) {
      const control = form.get(controlKey);
      if (control?.value) recipients.push({roleUuid: controlKey})
    }
    return recipients;
  }

  private onComplete(){
    this.onCreateNotification();
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
}
