/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComboBoxComponent as KendoComboBoxComponent, DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { combineLatest, debounceTime, Subject } from 'rxjs';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-dropdown',
  templateUrl: 'dropdown.component.html',
  styleUrls: ['dropdown.component.scss'],
})
export class DropdownComponent<T> extends BaseComponent implements OnInit, OnChanges {
  @Input() public text = '';
  @Input() public data?: T[] | null;
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

  private formDataSubject = new Subject<T[]>();
  private formValueSubject = new Subject<T>();

  @ViewChild('combobox') combobox?: KendoComboBoxComponent;

  ngOnInit() {
    if (!this.formName) return;

    this.subscriptions.add(
      // Add obsolete value when value in a form control is set to something which data does not contain
      this.formGroup?.controls[this.formName]?.valueChanges.subscribe((value) => this.formValueSubject.next(value))
    );

    this.subscriptions.add(
      combineLatest([this.formValueSubject, this.formDataSubject])
        .pipe(debounceTime(20))
        .subscribe(([value]) => this.addObsoleteValueIfMissingToData(value))
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.formName) return;

    // Add obsolete value when data is set but does not contain current form control value
    if (changes['data'] && this.data) {
      this.formDataSubject.next(this.data);
    }
  }

  private addObsoleteValueIfMissingToData(value?: any) {
    if (!this.hasGuardedForObsoleteFormValue && this.data && this.doesDataContainValue(value)) {
      this.hasGuardedForObsoleteFormValue = true;

      // Add missing value to data array with custom text telling that this value is obselete
      const text = $localize`${this.valuePrimitive ? value : value[this.textField]} (udgået)`;
      this.data = [...this.data, { ...value, [this.textField]: text } as T];

      // Value object is already bound on the controlling form group without the custom text, so
      // we have to assign the custom text to the combobox input field manually.
      const input = this.combobox?.wrapper.nativeElement.querySelector('input');
      if (input) {
        input.value = text;
      }
    }
  }

  private doesDataContainValue(value?: any): boolean {
    if (!this.data || value === undefined || value === null) return false;

    const valueToFind = this.valuePrimitive ? value : value[this.valueField];

    return !this.data.some(
      (option: any) => option[this.valueField] !== undefined && option[this.valueField] === valueToFind
    );
  }
}
