/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-dropdown',
  templateUrl: 'dropdown.component.html',
  styleUrls: ['dropdown.component.scss'],
})
export class DropdownComponent<T> extends BaseComponent implements OnInit, OnChanges {
  @Input() public text = '';
  @Input() public data!: T[] | null;
  @Input() public textField = 'name';
  @Input() public valueField = 'value';
  @Input() public valuePrimitive = false;
  @Input() public loading = false;
  @Input() public disabled = false;
  @Input() public size: 'small' | 'large' = 'large';

  @Input() public formGroup?: FormGroup;
  @Input() public formName: string | null = null;

  @Input() public value?: T | null;
  @Output() public valueChange = new EventEmitter<T | undefined>();

  public readonly filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  private hasGuardedForObsoleteFormValue = false;

  ngOnInit() {
    if (!this.formName) return;

    this.subscriptions.add(
      // Add obsolete value when value in a form control is set to something which data does not contain
      this.formGroup?.controls[this.formName]?.valueChanges.subscribe((value) => {
        this.addObsoleteValueIfMissingToData(value);
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.formName) return;

    // Add obsolete value when data is set but does not contain current form control value
    if (changes['data'] && this.data) {
      const value = this.formGroup?.controls[this.formName]?.value;
      this.addObsoleteValueIfMissingToData(value);
    }
  }

  private addObsoleteValueIfMissingToData(value?: any) {
    if (
      !this.hasGuardedForObsoleteFormValue &&
      value &&
      this.data &&
      this.data.length > 0 &&
      !this.data.some((option: any) => {
        return (
          (option[this.valueField] !== undefined && option[this.valueField] === value) ||
          (option[this.textField] !== undefined && option[this.textField] === value[this.textField])
        );
      })
    ) {
      this.hasGuardedForObsoleteFormValue = true;
      const text = $localize`${value} (udgået)`;
      this.data = [...this.data, { [this.textField]: text, [this.valueField]: value } as T];
    }
  }
}
