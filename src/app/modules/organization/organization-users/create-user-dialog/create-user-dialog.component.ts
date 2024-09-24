import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import {
  startPereferenceChoiceOptions,
  StartPreferenceChoice,
} from 'src/app/shared/models/organization-user/start-preference.model';
import { phoneNumberLengthValidator } from 'src/app/shared/validators/phone-number-length.validator';
import { requiredIfDirtyValidator } from 'src/app/shared/validators/required-if-dirty.validator';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.scss',
})
export class CreateUserDialogComponent {
  public createForm = new FormGroup({
    firstName: new FormControl<string | undefined>(undefined, [requiredIfDirtyValidator()]),
    lastName: new FormControl<string | undefined>(undefined, [requiredIfDirtyValidator()]),
    email: new FormControl<string | undefined>(undefined, [requiredIfDirtyValidator(), Validators.email]),
    repeatEmail: new FormControl<string | undefined>(undefined, [
      requiredIfDirtyValidator(),
      Validators.email,
      this.emailMatchValidator.bind(this),
    ]),
    phoneNumber: new FormControl<number | undefined>(undefined, [phoneNumberLengthValidator()]),
    startPreference: new FormControl<StartPreferenceChoice | undefined>(undefined),
    sendNotificationOnCreation: new FormControl<boolean>(false),
  });

  public startPreferenceOptions = startPereferenceChoiceOptions;

  private emailMatchValidator(control: AbstractControl): ValidationErrors | null {
    if (this.createForm) {
      const email = this.createForm.get('email')?.value;
      const repeatEmail = control.value;
      if (email !== repeatEmail) {
        return { emailMismatch: true };
      }
    }
    return null;
  }
}
