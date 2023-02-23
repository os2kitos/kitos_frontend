import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateGreaterThanValidator(startControl: AbstractControl): ValidatorFn {
  return (endControl: AbstractControl): ValidationErrors | null => {
    const startDate: Date = startControl.value;
    const endDate: Date = endControl.value;
    if (!startDate || !endDate) {
      return null;
    }
    if (startDate.setHours(0, 0, 0, 0) > endDate.setHours(0, 0, 0, 0)) {
      return { greaterThan: true };
    }
    return null;
  };
}

export function dateLessThanValidator(startControl: AbstractControl): ValidatorFn {
  return (endControl: AbstractControl): ValidationErrors | null => {
    const startDate: Date = startControl.value;
    const endDate: Date = endControl.value;
    if (!startDate || !endDate) {
      return null;
    }
    if (startDate.setHours(0, 0, 0, 0) < endDate.setHours(0, 0, 0, 0)) {
      return { lessThan: true };
    }
    return null;
  };
}
