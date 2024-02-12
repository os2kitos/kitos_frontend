import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';
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
    notificationTypeControl: new FormControl<NotificationType | undefined>(undefined),
    nameControl: new FormControl<string | undefined>(undefined),
    repetitionControl: new FormControl<NotificationRepetitionFrequency | undefined>(undefined),
    fromDateControl: new FormControl<Date | undefined>(undefined),
    toDateControl: new FormControl<Date | undefined>(undefined)
  });

  public readonly roleRecipientsForm = new FormGroup({});
  public readonly roleCcsForm = new FormGroup({});

  constructor(private readonly notificationService: NotificationService) {}

  ngOnInit(): void {
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
        this.toggleRepetitionFields(newValue === this.notificationTypeOptions[1].value)
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
    }
  }

}
