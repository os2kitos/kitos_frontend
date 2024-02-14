import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
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

export function dateLessThanOrEqualDateValidator(startDate: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlDate = toDate(control.value);
    if (!startDate || !controlDate) {
      return null;
    }
    if (startDate.setHours(0, 0, 0, 0) >= controlDate.setHours(0, 0, 0, 0)) {
      return { lessThan: true };
    }
    return null;
  }
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

export function checkboxesCheckedValidator(numRequired = 1): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    if (formGroup instanceof FormGroup){
      let numChecked = 0;
      Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.controls[key];
      if (control.value) numChecked++;
      })

      return numChecked >= numRequired ? null : { CheckboxesChecked: true };
    }
    throw new Error('From provided to validator should be of type FormGroup')
  }
}
