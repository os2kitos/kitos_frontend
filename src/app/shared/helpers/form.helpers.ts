import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

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

export function dateGreaterThanControlValidator(startControl: AbstractControl): ValidatorFn {
  return (endControl: AbstractControl): ValidationErrors | null => {
    return compareControlDates(
      startControl,
      endControl,
      (a: Date, b: Date) => a.setHours(0, 0, 0, 0) > b.setHours(0, 0, 0, 0),
      { greaterThan: true })
  }
}

export function dateLessThanControlValidator(startControl: AbstractControl): ValidatorFn {
  return (endControl: AbstractControl): ValidationErrors | null => {
    return compareControlDates(
      startControl,
      endControl,
      (a: Date, b: Date) => a.setHours(0, 0, 0, 0) < b.setHours(0, 0, 0, 0),
      { lessThan: true })
  }
}

export function dateLessThanOrEqualToDateValidator(startDate: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlDate = toDate(control.value);
    return compareDates(
      startDate,
      controlDate,
      (a: Date, b: Date) => a.setHours(0, 0, 0, 0) >= b.setHours(0, 0, 0, 0),
      { lessThanOrEqualTo: true }
    )
  }
}

export function atLeastOneCheckboxCheckedValidator(formGroup: AbstractControl): ValidationErrors | null {
  if (formGroup instanceof FormGroup) {
    const controls = formGroup.controls;
    const isAtLeastOneChecked = Object.keys(controls).some(key => controls[key].value === true);
    return isAtLeastOneChecked ? null : { 'atLeastOneRequired': true };
  }
  return null;
}

export function atLeastOneNonEmptyValidator(formArray: AbstractControl): ValidationErrors | null {
  if (formArray instanceof FormArray) {
    const controls = formArray.controls;
    const validControls = controls.filter(ctrl => ctrl.valid && ctrl.value != null);
    return validControls.length > 0 ? null : { 'atLeastOneValid': true };
  }
  return null;
}

function compareControlDates(startControl: AbstractControl, endControl: AbstractControl,
  comparator: (a: Date, b: Date) => boolean, onInvalid: OnInvalid) {
  const startDate = toDate(startControl.value);
  const endDate = toDate(endControl.value);
  return compareDates(startDate, endDate, comparator, onInvalid);
}

function compareDates(startDate: Date | undefined, endDate: Date | undefined,
  comparator: (a: Date, b: Date) => boolean, onInvalid: OnInvalid) {
  if (!startDate || !endDate) return null;
  return comparator(startDate, endDate) ? onInvalid : null;
}

