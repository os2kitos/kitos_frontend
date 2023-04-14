/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, OnChanges, OnInit } from '@angular/core';
import { combineLatest, debounceTime } from 'rxjs';
import { BaseDropdownComponent } from '../../base/base-dropdown.component';

@Component({
  selector: 'app-dropdown',
  templateUrl: 'dropdown.component.html',
  styleUrls: ['dropdown.component.scss'],
})
export class DropdownComponent<T> extends BaseDropdownComponent<T | null> implements OnInit, OnChanges {
  private hasGuardedForObsoleteFormValue = false;
  private obseleteDataOption?: T;

  override ngOnInit() {
    super.ngOnInit();

    // Add obselete value when both value and data are present if data does not contain current form value
    this.subscriptions.add(
      combineLatest([this.formValueSubject$, this.formDataSubject$])
        .pipe(debounceTime(20))
        .subscribe(([value]) => this.addObsoleteValueIfMissingToData(value))
    );

    if (!this.formName) return;

    // Update value subject to be used in calculating obselete values
    this.subscriptions.add(
      this.formGroup?.controls[this.formName]?.valueChanges.subscribe((value) => this.formValueSubject$.next(value))
    );

    // Push initial values to value and data form subjects
    this.formValueSubject$.next(this.formGroup?.controls[this.formName]?.value);
    this.formDataSubject$.next(this.data ?? []);
  }

  override formSelectionChange(formValue?: any) {
    super.formSelectionChange(formValue);

    // Remove obselete option after selection changes
    if (this.obseleteDataOption) {
      this.data = this.data?.filter((option) => option !== this.obseleteDataOption);
    }
  }

  private addObsoleteValueIfMissingToData(value?: any) {
    if (!this.hasGuardedForObsoleteFormValue && this.data && this.doesDataContainValue(value)) {
      this.hasGuardedForObsoleteFormValue = true;

      // Add missing value to data array with custom text telling that this value is obselete.
      // Also set the updated value on the form control.
      this.obseleteDataOption = { ...value, [this.textField]: $localize`${value[this.textField]} (udgået)` };
      if (this.obseleteDataOption && this.formName) {
        this.data = [...this.data, this.obseleteDataOption];
        this.formGroup?.controls[this.formName].setValue(this.obseleteDataOption, { emitEvent: false });
      }
    }
  }

  private doesDataContainValue(value?: any): boolean {
    if (!this.data || value === undefined || value === null) return false;

    return !this.data.some(
      (option: any) => option[this.valueField] !== undefined && option[this.valueField] === value[this.valueField]
    );
  }
}
