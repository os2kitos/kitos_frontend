import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { distinctUntilChanged } from 'rxjs';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { checkboxesCheckedValidator, dateGreaterThanControlValidator, dateLessThanOrEqualToDateValidator } from 'src/app/shared/helpers/form.helpers';
import { NotificationRepetitionFrequency } from 'src/app/shared/models/notification-repetition-frequency.model';
import { NotificationType, notificationTypeOptions } from 'src/app/shared/models/notification-type.model';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NotificationsTableComponentStore } from '../notifications-table.component-store';
import { NOTIFICATIONS_DIALOG_DEFAULT_WIDTH } from 'src/app/shared/constants';

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
  @Input() public onConfirm!: (notificationForm: FormGroup, roleRecipientsForm: FormGroup, roleCcsForm: FormGroup,
    emailRecipientsFormArray: FormArray, emailCcsFormArray: FormArray) => void;
  @Input() public confirmText!: string;

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
    )
    {
      dialogRef.updateSize(`${NOTIFICATIONS_DIALOG_DEFAULT_WIDTH}px`);
    }

  ngOnInit(): void {
    this.setupNotificationControls();
    this.setupRecipientControls();
    this.setupRecipientFieldsRelationship();
  }

  public handleClickConfirm(){
    this.onConfirm(this.notificationForm, this.roleRecipientsForm, this.roleCcsForm, this.emailRecipientsFormArray, this.emailCcsFormArray);
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

  public onAddEmailField(formArrayName: string){
    const formArray = this.notificationForm.get(formArrayName) as FormArray;
    formArray.controls.push(new FormControl<string | undefined>(undefined, Validators.email));
  }

  public onRemoveEmailField(index: number, formArrayName: string){
    const formArray = this.notificationForm.get(formArrayName) as FormArray;
    if (formArray.controls.length > 1){
      formArray.controls.splice(index, 1);
    }
  }

  private compareAsJson = (a: unknown, b: unknown): boolean =>
    JSON.stringify(a) === JSON.stringify(b)

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
