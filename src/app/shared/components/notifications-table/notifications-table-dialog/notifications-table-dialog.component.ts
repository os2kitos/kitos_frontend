import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { APIEmailRecipientResponseDTO, APINotificationResponseDTO, APIRegularOptionResponseDTO, APIRoleRecipientResponseDTO } from 'src/app/api/v2';
import { NOTIFICATIONS_DIALOG_DEFAULT_WIDTH } from 'src/app/shared/constants';
import { atLeastOneCheckboxCheckedValidator, atLeastOneNonEmptyValidator, dateGreaterThanOrEqualControlValidator, dateGreaterThanOrEqualToDateValidator } from 'src/app/shared/helpers/form.helpers';
import { NotificationRepetitionFrequency, mapNotificationRepetitionFrequency } from 'src/app/shared/models/notification-repetition-frequency.model';
import { NotificationType, mapNotificationType, notificationTypeOptions } from 'src/app/shared/models/notification-type.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { AppRootUrlResolverServiceService } from 'src/app/shared/services/app-root-url-resolver-service.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NotificationsTableComponentStore } from '../notifications-table.component-store';

@Component({
  selector: 'app-notifications-table-dialog',
  templateUrl: './notifications-table-dialog.component.html',
  styleUrl: './notifications-table-dialog.component.scss',
  providers: [NotificationsTableComponentStore]
})
export class NotificationsTableDialogComponent implements OnInit {
  @Input() public title!: string;
  @Input() public systemUsageRolesOptions!: Array<APIRegularOptionResponseDTO>;
  @Input() public notificationRepetitionFrequencyOptions!: Array<NotificationRepetitionFrequency>;
  @Input() public ownerEntityUuid!: string;
  @Input() public organizationUuid!: string;
  @Input() public onConfirm!: (
    emailRecepientsForm: FormGroup, notificationForm: FormGroup, roleRecipientsForm: FormGroup, roleCcsForm: FormGroup,
    emailRecipientsFormArray: FormArray, emailCcsFormArray: FormArray, notificationUuid?: string) => void;
  @Input() public confirmText!: string;

  public readonly emailRecepientsForm = new FormGroup({
    emailRecipientsFormArray: new FormArray([new FormControl<string | undefined>(undefined, [Validators.email, Validators.required])]),
  });

  public readonly notificationForm = new FormGroup({
    emailCcsFormArray: new FormArray([new FormControl<string | undefined>(undefined, Validators.email)]),
    subjectControl: new FormControl<string | undefined>(undefined, Validators.required),
    notificationTypeControl: new FormControl<NotificationType | undefined>(undefined, Validators.required),
    nameControl: new FormControl<string | undefined>(undefined),
    repetitionControl: new FormControl<NotificationRepetitionFrequency | undefined>(undefined, Validators.required),
    fromDateControl: new FormControl<Date | undefined>(undefined, Validators.required),
    toDateControl: new FormControl<Date | undefined>(undefined),
    bodyControl: new FormControl<string | undefined>(undefined, Validators.required)
  });

  get emailRecipientsFormArray(): FormArray {
    return this.emailRecepientsForm.get('emailRecipientsFormArray') as FormArray;
  }

  get emailCcsFormArray(): FormArray {
    return this.notificationForm.get('emailCcsFormArray') as FormArray;
  }

  emailFormArray(contextName: string): FormArray | undefined {
    switch (contextName) {
      case "emailRecipientsFormArray": return this.emailRecipientsFormArray;
      case "emailCcsFormArray": return this.emailCcsFormArray;
    }
    return undefined;
  }

  public readonly roleRecipientsForm = new FormGroup({});
  public readonly roleCcsForm = new FormGroup({});

  public readonly notificationTypeOptions = notificationTypeOptions;
  public readonly notificationTypeImmediate = this.notificationTypeOptions[0];
  public readonly notificationTypeRepeat = this.notificationTypeOptions[1];

  public showDateOver28Tooltip: boolean = false;
  public notification: APINotificationResponseDTO | undefined;
  public currentNotificationSent$ = this.componentStore.currentNotificationSent$;

  public root: string;

  constructor(
    private readonly appRootUrlResolverService: AppRootUrlResolverServiceService,
    private readonly notificationService: NotificationService,
    private readonly dialogRef: MatDialogRef<NotificationsTableDialogComponent>,
    private readonly componentStore: NotificationsTableComponentStore,
    @Inject(MAT_DIALOG_DATA) public data: APINotificationResponseDTO
  ) {
    dialogRef.updateSize(`${NOTIFICATIONS_DIALOG_DEFAULT_WIDTH}px`);
    if (data) this.notification = data;
    this.root = this.appRootUrlResolverService.resolveRootUrl();
  }

  ngOnInit(): void {
    this.setupNotificationControls();
    this.setupRoleRecipientControls();

    if (this.hasImmediateNotification()) {
      this.notificationForm.disable();
      this.emailRecepientsForm.disable();
      this.roleRecipientsForm.disable();
      this.roleCcsForm.disable();
      this.emailRecipientsFormArray.controls.forEach((control) => control.disable());
      this.emailCcsFormArray.controls.forEach((control) => control.disable());
    }

    if (this.notification && this.notification.notificationType === this.notificationTypeRepeat.value) {
      this.toggleRepetitionFields(true);
      this.setupSentTable();
    }
    else {
      this.toggleRepetitionFields(false);
      const notificationControls = this.notificationForm.controls;
      notificationControls.notificationTypeControl.setValue(mapNotificationType(this.notificationTypeImmediate.value));
    }
  }

  private setupNotificationControls() {
    const notificationControls = this.notificationForm.controls;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    notificationControls.fromDateControl.addValidators(dateGreaterThanOrEqualToDateValidator(today));
    notificationControls.toDateControl.validator = dateGreaterThanOrEqualControlValidator(this.notificationForm.controls.fromDateControl);
    notificationControls.fromDateControl.valueChanges.subscribe(() => this.toggleShowDateOver28Tooltip());
    notificationControls.repetitionControl.valueChanges.subscribe(() => this.toggleShowDateOver28Tooltip());

    if (this.notification) {
      const fromDate = this.notification.fromDate;
      if (fromDate) notificationControls.fromDateControl.setValue(new Date(fromDate));
      const toDate = this.notification.toDate;
      if (toDate) notificationControls.toDateControl.setValue(new Date(toDate));
      notificationControls.subjectControl.setValue(this.notification.subject);
      notificationControls.nameControl.setValue(this.notification.name);
      notificationControls.bodyControl.setValue(this.notification.body);
      notificationControls.notificationTypeControl.setValue(mapNotificationType(this.notification.notificationType));
      notificationControls.repetitionControl.setValue(mapNotificationRepetitionFrequency(this.notification.repetitionFrequency));

      this.setupEmailRecipientData(this.notification.receivers?.emailRecipients, this.emailRecipientsFormArray);
      this.setupEmailRecipientData(this.notification.cCs?.emailRecipients, this.emailCcsFormArray);
    }
    this.emailRecipientsFormArray.addValidators(atLeastOneNonEmptyValidator);
    this.emailRecipientsFormArray.updateValueAndValidity();
  }

  private setupEmailRecipientData(recipients: APIEmailRecipientResponseDTO[] | undefined, formArray: FormArray) {
    const lastControl = formArray.controls[formArray.controls.length - 1];
    recipients?.forEach((recipient) => {
      if (!lastControl.value) lastControl.setValue(recipient.email);
      else formArray.controls.push(new FormControl<string | undefined>(recipient.email, [Validators.email, Validators.required]));
    })
  }

  private setupRoleRecipientControls() {
    this.systemUsageRolesOptions.forEach((option) => {
      this.roleRecipientsForm.addControl(option.uuid, new FormControl<boolean>(false));
      this.roleCcsForm.addControl(option.uuid, new FormControl<boolean>(false));
    })
    if (this.notification) {
      this.setupRoleRecipientData(this.notification.receivers?.roleRecipients, this.roleRecipientsForm);
      this.setupRoleRecipientData(this.notification.cCs?.roleRecipients, this.roleCcsForm);
    }
    this.roleRecipientsForm.setValidators(atLeastOneCheckboxCheckedValidator);
    this.roleRecipientsForm.updateValueAndValidity();
  }

  private setupRoleRecipientData(recipients: APIRoleRecipientResponseDTO[] | undefined, form: FormGroup) {
    recipients?.forEach((recipient) => {
      for (const controlKey in form.controls) {
        if (controlKey === recipient.role?.uuid) {
          const control = form.get(controlKey);
          control?.setValue(true);
        }
      }
    })
  }

  public formatDate(date: string | undefined) {
    if (date) {
      return new Date(date).toLocaleString()
    }
    return $localize`Ugyldig dato fundet.`
  }

  private setupSentTable() {
    if (this.notification?.uuid) this.componentStore.getCurrentNotificationSent({
      ownerResourceUuid: this.ownerEntityUuid,
      notificationUuid: this.notification.uuid
    })
  }

  private hasImmediateNotification = () =>
    this.notification && this.notification.notificationType !== this.notificationTypeRepeat.value;

  public handleClickConfirm() {
    this.onConfirm(this.emailRecepientsForm, this.notificationForm, this.roleRecipientsForm, this.roleCcsForm, this.emailRecipientsFormArray, this.emailCcsFormArray);
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

  public repeatIsSelected() {
    return this.notificationForm.controls.notificationTypeControl.value === this.notificationTypeRepeat;
  }

  public onAddEmailField(formArrayName: string) {
    const formArray = this.emailFormArray(formArrayName) as FormArray;
    formArray.controls.push(new FormControl<string | undefined>(undefined, Validators.email));
  }

  public onRemoveEmailField(index: number, formArrayName: string) {
    const formArray = this.emailFormArray(formArrayName) as FormArray;
    if (formArray.controls.length > 1 && !this.hasImmediateNotification()) {
      formArray.controls.splice(index, 1);
    }
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
        this.notificationRepetitionFrequencyOptions.findIndex((option) => option.value === repetition?.value)
        > 2;

      this.showDateOver28Tooltip = dayOfMonth > 28 && repetitionIsMonthOrMore;
    }
  }
}
