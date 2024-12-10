import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cvrValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const valueStr = value.toString();

    if (valueStr.length !== 8 && valueStr.length !== 0) {
      return { cvrLength: true };
    }
    const regex = /^[0-9]+$/;
    if (!regex.test(valueStr)) {
      return { cvrDigits: true };
    }
    return null;
  };
}
