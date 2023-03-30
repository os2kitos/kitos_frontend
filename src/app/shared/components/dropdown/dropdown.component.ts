/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { combineLatest, debounceTime, filter, map, Subject } from 'rxjs';
import { BaseFormComponent } from '../../base/base-form.component';
import { DEFAULT_INPUT_DEBOUNCE_TIME } from '../../constants';
import { TreeNodeModel } from '../tree-node-select/tree-node-select.component';

@Component({
  selector: 'app-dropdown',
  templateUrl: 'dropdown.component.html',
  styleUrls: ['dropdown.component.scss'],
})
export class DropdownComponent<T> extends BaseFormComponent<T | null> implements OnInit, OnChanges {
  @Input() public data?: T[] | null;
  @Input() public textField = 'name';
  @Input() public valueField = 'value';
  @Input() public loading: boolean | null = false;
  @Input() public size: 'medium' | 'large' = 'large';

  @Input() public showDescription = false;
  @Input() public showSearchHelpText: boolean | null = false;

  @Input() public renderHierarchy = false;

  @Output() public filterChange = new EventEmitter<string | undefined>();

  public description?: string;

  private hasGuardedForObsoleteFormValue = false;
  private obseleteDataOption?: T;

  private readonly formDataSubject$ = new Subject<T[]>();
  private readonly formValueSubject$ = new Subject<T>();

  public readonly filter$ = new Subject<string>();

  public readonly clearAllText = $localize`Ryd`;
  public readonly loadingText = $localize`Henter data`;
  public readonly notFoundText = $localize`Ingen data fundet`;

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

    // Debounce update of dropdown filter with more then 1 character and filter hierarchy
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
    this.subscriptions.add(
      combineLatest([this.formValueSubject$, this.formDataSubject$])
        .pipe(
          filter(() => this.showDescription),
          map(([value, data]) =>
            data?.find((data: any) => !!value && data[this.valueField] === (value as any)[this.valueField])
          )
        )
        .subscribe((value: any) => (this.description = value?.description))
    );

    // Add obselete value when both value and data are present if data does not contain current form value
    this.subscriptions.add(
      combineLatest([this.formValueSubject$, this.formDataSubject$])
        .pipe(debounceTime(20))
        .subscribe(([value]) => this.addObsoleteValueIfMissingToData(value))
    );

    // Update value subject to be used in calculating obselete values
    this.subscriptions.add(
      this.formGroup?.controls[this.formName]?.valueChanges.subscribe((value) => this.formValueSubject$.next(value))
    );

    // Push initial values to value and data form subjects
    this.formValueSubject$.next(this.formGroup?.controls[this.formName]?.value);
    this.formDataSubject$.next(this.data ?? []);
  }

  ngOnChanges(changes: SimpleChanges) {
    // Update data subject to be used in calculating obselete values
    if (this.formName && changes['data'] && this.data) {
      this.formDataSubject$.next(this.data);
    }
  }

  public formSelectionChange(formValue?: any) {
    if (!this.formName) return;

    // Handle form clear and selection change
    const value = formValue === undefined || formValue === null ? null : formValue && formValue[this.valueField];
    this.valueChange.emit(value);
    const valid = this.formGroup?.controls[this.formName]?.valid ?? true;
    this.validatedValueChange.emit({ value, text: this.text, valid });

    // Remove obselete option after selection changes
    if (this.obseleteDataOption) {
      this.data = this.data?.filter((option) => option !== this.obseleteDataOption);
    }
  }

  private lookup: { term: string; data: TreeNodeModel[] } | null = null;

  public customSearchFunction = (term: string, item: TreeNodeModel) => {
    const treeNodes = this.data as TreeNodeModel[];

    if (!this.lookup || this.lookup.term !== term) {
      this.lookup = { term: term, data: treeNodes.filter((x) => x.name.includes(term)) };
    }
    let result = this.lookup.data;
    this.lookup.data.forEach((x) => (result = result.concat(this.searchParents(x, treeNodes))));
    return result.map((x) => x.id).includes(item.id);
  };

  private searchParents(currentItem: TreeNodeModel, items: TreeNodeModel[]): TreeNodeModel[] {
    const searchFor = items.filter((x) => x.id === currentItem.parentId);
    let result = searchFor;
    searchFor.forEach((x) => (result = result.concat(this.searchParents(x, items))));

    return result;
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
