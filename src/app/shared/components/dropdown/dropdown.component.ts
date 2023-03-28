/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ComboBoxComponent as KendoComboBoxComponent, DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { combineLatest, debounceTime, filter, map, Observable, startWith, Subject } from 'rxjs';
import { BaseFormComponent } from '../../base/base-form.component';
import { DEFAULT_INPUT_DEBOUNCE_TIME } from '../../constants';

@Component({
  selector: 'app-dropdown',
  templateUrl: 'dropdown.component.html',
  styleUrls: ['dropdown.component.scss'],
})
export class DropdownComponent<T> extends BaseFormComponent<T | null> implements OnInit, OnChanges {
  @Input() public data?: T[] | null;
  @Input() public textField = 'name';
  @Input() public valueField = 'value';
  @Input() public valuePrimitive = false;
  @Input() public showDescription = false;
  @Input() public loading: boolean | null = false;
  @Input() public showSearchHelpText: boolean | null = false;
  @Input() public size: 'medium' | 'large' = 'large';

  @Output() public filterChange = new EventEmitter<string | undefined>();

  public readonly filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  private hasGuardedForObsoleteFormValue = false;
  private obseleteDataOption?: T;

  private formDataSubject$ = new Subject<T[]>();
  private formValueSubject$ = new Subject<T>();

  public filter$ = new Subject<string>();

  public description$?: Observable<string | undefined>;

  @ViewChild('combobox') combobox?: KendoComboBoxComponent;

  override ngOnInit() {
    super.ngOnInit();

    // Debounce update of dropdown filter with more then 1 character
    this.subscriptions.add(
      this.filter$
        .pipe(
          filter((filter) => filter.length !== 1),
          debounceTime(DEFAULT_INPUT_DEBOUNCE_TIME),
          map((filter) => filter || undefined)
        )
        .subscribe((filter) => this.filterChange.emit(filter))
    );

    if (!this.formName) return;

    // Extract possible description from data value if enabled
    this.description$ = combineLatest([
      this.formValueSubject$.pipe(startWith(this.formGroup?.controls[this.formName ?? '']?.value)),
      this.formDataSubject$.pipe(startWith(this.data)),
    ]).pipe(
      filter(() => this.showDescription && !this.valuePrimitive),
      map(([value, data]) =>
        data?.find((data: any) => !!value && data[this.valueField] === (value as any)[this.valueField])
      ),
      map((value: any) => value?.description),
      map((description?: string) => (description === '...' ? undefined : description))
    );

    // Update value subject to be used in calculating obselete values
    this.subscriptions.add(
      this.formGroup?.controls[this.formName]?.valueChanges.subscribe((value) => this.formValueSubject$.next(value))
    );

    // Add obselete value when both value and data are present if data does not contain current form value
    this.subscriptions.add(
      combineLatest([this.formValueSubject$, this.formDataSubject$])
        .pipe(debounceTime(20))
        .subscribe(([value]) => this.addObsoleteValueIfMissingToData(value))
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.formName) return;

    // Update data subject to be used in calculating obselete values
    if (changes['data'] && this.data) {
      this.formDataSubject$.next(this.data);
    }
  }

  public formSelectionChange(formValue?: any) {
    if (!this.formName) return;

    const valid = this.formGroup?.controls[this.formName]?.valid ?? true;

    // Handle form clear and selection change
    const value = formValue === undefined || formValue === null ? null : formValue && formValue[this.valueField];
    this.valueChange.emit(value);
    this.validatedValueChange.emit({ value, text: this.text, valid });

    // Remove obselete option after selection changes
    if (this.obseleteDataOption) {
      this.data = this.data?.filter((option: any) => option !== this.obseleteDataOption);
    }
  }

  private addObsoleteValueIfMissingToData(value?: any) {
    if (!this.hasGuardedForObsoleteFormValue && this.data && this.doesDataContainValue(value)) {
      this.hasGuardedForObsoleteFormValue = true;

      // Add missing value to data array with custom text telling that this value is obselete
      const text = $localize`${this.valuePrimitive ? value : value[this.textField]} (udgået)`;
      this.obseleteDataOption = { ...value, [this.textField]: text };
      if (this.obseleteDataOption) this.data = [...this.data, this.obseleteDataOption];

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
