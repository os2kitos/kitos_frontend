import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { MAX_DATE } from '../constants';

interface OnInvalid {
  [key: string]: boolean;
}

function toDate(input: unknown): Date | undefined {
  let convertedDate: Date | undefined;
  if (input) {
    convertedDate = moment(input).toDate();
  }
  return convertedDate;
}

export function integerStringLessThanOrEqualTo(limit: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const numericValue = parseInt(value);

    return (isNaN(numericValue) || numericValue > limit)
      ? { 'numericStringLessThanOrEqual': { value: control.value } }
      : null;
  }
}

export function atLeastOneCheckboxCheckedValidator(formGroup: AbstractControl): ValidationErrors | null {
  if (formGroup instanceof FormGroup) {
    const controls = formGroup.controls;
    const isAtLeastOneChecked = Object.keys(controls).some((key) => controls[key].value === true);
    return isAtLeastOneChecked ? null : { atLeastOneRequired: true };
  }
  return null;
}

export function atLeastOneNonEmptyValidator(formArray: AbstractControl): ValidationErrors | null {
  if (formArray instanceof FormArray) {
    const controls = formArray.controls;
    const validControls = controls.filter((ctrl) => ctrl.valid && ctrl.value != null);
    return validControls.length > 0 ? null : { atLeastOneValid: true };
  }
  return null;
}

enum DateComparison {
  LtEq,
  GtEq,
  Gt,
  Lt,
}

export function dateLessThanControlValidator(comparedToControl: AbstractControl): ValidatorFn {
  return (endControl: AbstractControl): ValidationErrors | null => {
    const controlDate = toDate(endControl.value);
    const comparedToDate = toDate(comparedToControl.value) ?? new Date(MAX_DATE);
    return compareDatesBy(controlDate, comparedToDate, DateComparison.Lt);
  };
}

export function dateLessThanOrEqualControlValidator(comparedToControl: AbstractControl): ValidatorFn {
  return (endControl: AbstractControl): ValidationErrors | null => {
    const controlDate = toDate(endControl.value);
    const comparedToDate = toDate(comparedToControl.value) ?? new Date(MAX_DATE);
    return compareDatesBy(controlDate, comparedToDate, DateComparison.LtEq);
  };
}

export function dateLessThanOrEqualToDateValidator(date: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlDate = toDate(control.value);
    return compareDatesBy(controlDate, date, DateComparison.LtEq);
  };
}

export function dateGreaterThanOrEqualToDateValidator(date: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlDate = toDate(control.value);
    return compareDatesBy(controlDate, date, DateComparison.GtEq);
  };
}

export function dateGreaterThanOrEqualControlValidator(comparedToControl: AbstractControl): ValidatorFn {
  return (endControl: AbstractControl): ValidationErrors | null => {
    const controlDate = toDate(endControl.value);
    const comparedToDate = toDate(comparedToControl.value) ?? new Date(0);
    return compareDatesBy(controlDate, comparedToDate, DateComparison.GtEq);
  };
}

function compareDatesBy(controlDate: Date | undefined, date: Date, operator: DateComparison): ValidationErrors | null {
  date.setHours(0, 0, 0, 0);
  return compareDates(
    controlDate,
    date,
    (a: Date, b: Date) => {
      const dateA = new Date(a.setHours(0, 0, 0, 0));
      const dateB = new Date(b.setHours(0, 0, 0, 0));
      switch (operator) {
        case DateComparison.LtEq:
          return dateA <= dateB;
        case DateComparison.GtEq:
          return dateA >= dateB;
        case DateComparison.Gt:
          return dateA > dateB;
        case DateComparison.Lt:
          return dateA < dateB;
        default:
          return false;
      }
    },
    { result: false }
  );
}

function compareDates(
  startDate: Date | undefined,
  endDate: Date | undefined,
  comparator: (a: Date, b: Date) => boolean,
  onInvalid: OnInvalid
) {
  if (!startDate || !endDate) return null;
  return comparator(startDate, endDate) ? null : onInvalid;
}
