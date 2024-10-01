import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { debounceTime, filter, map, Subject } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { DEFAULT_INPUT_DEBOUNCE_TIME } from 'src/app/shared/constants';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';

export interface MultiSelectDropdownItem<T> {
  name: string;
  value: T;
  selected: boolean;
}

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrl: './multi-select-dropdown.component.scss',
})
export class MultiSelectDropdownComponent<T> extends BaseComponent implements OnInit, AfterViewInit {
  @Input() public text = '';
  @Input() public disabled = false;
  @Input() public textField = 'name';
  @Input() public valueField = 'value';
  @Input() public size: 'medium' | 'large' = 'large';

  @Input() public data?: MultiSelectDropdownItem<T>[] | null;
  @Input() public loading: boolean | null = false;

  @Output() public valueChange = new EventEmitter<T[] | undefined>();
  @Output() public validatedValueChange = new EventEmitter<ValidatedValueChange<T[] | undefined>>();

  @Output() public focusEvent = new EventEmitter();
  @Output() public openDropdown = new EventEmitter();
  @Output() public cleared = new EventEmitter();
  @Output() public blurEvent = new EventEmitter();
  @Output() public selectedEvent = new EventEmitter<T[]>();
  @Output() public filterChange = new EventEmitter<string | undefined>();

  public focused = false;
  public readonly filter$ = new Subject<string>();

  public readonly clearAllText = $localize`Ryd`;
  public readonly loadingText = $localize`Henter data`;
  public readonly notFoundText = $localize`Ingen data fundet`;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    super();
  }

  public selectedValues: T[] = [];
  public selectedValuesModel: MultiSelectDropdownItem<T>[] = [];

  ngOnInit() {
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
  }

  ngAfterViewInit() {
    const parentWidth = this.el.nativeElement.parentElement.offsetWidth;
    //needed for the hidden overflow
    this.renderer.setStyle(this.el.nativeElement.querySelector('ng-select'), 'max-width', `${parentWidth}px`);
    // Replace class ng-select-multiple with ng-select-single
    const ngSelectElement = this.el.nativeElement.querySelector('ng-select');
    this.renderer.removeClass(ngSelectElement, 'ng-select-multiple');
    this.renderer.addClass(ngSelectElement, 'ng-select-single');
  }

  public setValues(values: MultiSelectDropdownItem<T>[]) {
    console.log('setValues', values);
    this.selectedValuesModel = values;
    this.selectedValues = values.map((item) => item.value);
  }

  public onFocus() {
    this.focusEvent.emit();
  }

  public onOpen() {
    this.openDropdown.emit();
  }

  public onClear() {
    this.filter$.next('');
    this.cleared.emit();
  }

  public onBlur() {
    this.blurEvent.emit();
    this.selectedEvent.emit(this.selectedValues);
  }

  public onSelected(item: MultiSelectDropdownItem<T>) {
    console.log('onSelected', item);
    this.updateSelectedValues(item.value);
    console.log('selectedValues', this.selectedValues);
    this.selectedEvent.emit(this.selectedValues);
  }

  public clear() {
    this.valueChange.emit(undefined);
  }

  private updateSelectedValues(value: T) {
    const index = this.selectedValues.indexOf(value);
    if (index !== -1) {
      this.selectedValues.splice(index, 1);
    } else {
      this.selectedValues.push(value);
    }
  }
}
