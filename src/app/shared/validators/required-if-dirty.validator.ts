import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function requiredIfDirtyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.dirty && !control.value) {
      return { requiredIfDirty: true };
    }
    return null;
  };
}
