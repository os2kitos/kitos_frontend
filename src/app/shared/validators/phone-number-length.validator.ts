import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneNumberLengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (control.dirty && value && value.length !== 8 && value.length !== 0) {
      return { phoneNumberLength: true };
    }
    return null;
  };
}
