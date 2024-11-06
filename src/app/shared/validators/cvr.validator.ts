import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cvrValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value.length !== 8 && value.length !== 0) {
      return { cvrLength: true };
    }
    const regex = /^[0-9]+$/;
    if (!regex.test(value)) {
      return { cvrDigits: true };
    }
    return null;
  };
}
