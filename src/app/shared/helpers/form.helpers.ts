import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

function toDate(input: unknown): Date | undefined {
  let convertedDate: Date | undefined;
  if (input) {
    convertedDate = moment(input).toDate();
  }
  return convertedDate;
}

export function dateGreaterThanValidator(startControl: AbstractControl): ValidatorFn {
  return (endControl: AbstractControl): ValidationErrors | null => {
    const startDate = toDate(startControl.value);
    const endDate = toDate(endControl.value);
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
    const startDate = toDate(startControl.value);
    const endDate = toDate(endControl.value);
    if (!startDate || !endDate) {
      return null;
    }
    if (startDate.setHours(0, 0, 0, 0) < endDate.setHours(0, 0, 0, 0)) {
      return { lessThan: true };
    }
    return null;
  };
}
