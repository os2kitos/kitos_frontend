import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { checkboxesCheckedValidator, dateGreaterThanControlValidator, dateLessThanOrEqualToDateValidator } from 'src/app/shared/helpers/form.helpers';
import { NotificationRepetitionFrequency } from 'src/app/shared/models/notification-repetition-frequency.model';
import { NotificationType } from 'src/app/shared/models/notification-type.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-notifications-table.create-dialog',
  templateUrl: './notifications-table.create-dialog.component.html',
  styleUrl: './notifications-table.create-dialog.component.scss',
})
export class NotificationsTableCreateDialogComponent implements OnInit {
  @Input() public title!: string;
  @Input() public systemUsageRolesOptions!: Array<APIRegularOptionResponseDTO>;
  @Input() public notificationTypeOptions!: Array<NotificationType>;
  @Input() public notificationRepetitionFrequencyOptions!: Array<NotificationRepetitionFrequency>;

  public readonly notificationForm = new FormGroup({
    //emailRecipientControl: new FormControl<string | undefined>(undefined, Validators.email),
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

  public showDateOver28Tooltip: boolean = false;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly dialogRef: MatDialogRef<NotificationsTableCreateDialogComponent>) {}

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
        this.toggleRepetitionFields(newValue === this.notificationTypeOptions[1].value)
    }
  }

  public onCancel() {
    this.dialogRef.close();
  }

  public onSave() {
    console.log('body ' + this.notificationForm.controls.bodyControl.value)
    if (!this.notificationForm.valid || !this.roleRecipientsForm.valid || !this.roleCcsForm.valid) return;
    const subject = this.notificationForm.controls.subjectControl.value
    const notificationType = this.notificationForm.controls.notificationTypeControl.value
    //OBS post endpoint depends on immediate or scheduled

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
