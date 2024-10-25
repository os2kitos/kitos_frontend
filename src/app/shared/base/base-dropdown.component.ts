/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject, combineLatest, debounceTime, filter, map } from 'rxjs';
import { DEFAULT_INPUT_DEBOUNCE_TIME } from '../constants/constants';
import { BaseFormComponent } from './base-form.component';

@Component({
  template: '',
})
export class BaseDropdownComponent<T> extends BaseFormComponent<T | null> implements OnInit, OnChanges {
  @Input() public data?: T[] | null;
  @Input() public textField = 'name';
  @Input() public itemDescriptionField = 'description';
  @Input() public valueField = 'value';
  @Input() public loading: boolean | null = false;
  @Input() public showDescription = false;
  @Input() public showSearchHelpText: boolean | null = false;
  @Input() public size: 'medium' | 'large' = 'large';

  @Output() public filterChange = new EventEmitter<string | undefined>();

  public description?: string;

  protected readonly formDataSubject$ = new Subject<T[]>();
  protected readonly formValueSubject$ = new Subject<T>();

  public readonly filter$ = new Subject<string>();

  public readonly clearAllText = $localize`Ryd`;
  public readonly loadingText = $localize`Henter data`;
  public readonly notFoundText = $localize`Ingen data fundet`;

  constructor() {
    super();
  }

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
  }
}
