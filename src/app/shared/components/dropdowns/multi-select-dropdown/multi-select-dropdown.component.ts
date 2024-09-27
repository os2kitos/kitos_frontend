import { Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import { BaseDropdownComponent } from 'src/app/shared/base/base-dropdown.component';

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
export class MultiSelectDropdownComponent<T>
  extends BaseDropdownComponent<MultiSelectDropdownItem<T> | null>
  implements OnInit, OnChanges
{
  @Output() public focusEvent = new EventEmitter();
  @Output() public openDropdown = new EventEmitter();
  @Output() public cleared = new EventEmitter();
  @Output() public blurEvent = new EventEmitter();
  @Output() public selected = new EventEmitter<MultiSelectDropdownItem<T>>();

  override ngOnInit() {
    super.ngOnInit();

    if (!this.formName) return;

    // Update value subject to be used in calculating obselete values
    this.subscriptions.add(
      this.formGroup?.controls[this.formName]?.valueChanges.subscribe((value) => this.formValueSubject$.next(value))
    );

    // Push initial values to value and data form subjects
    this.formValueSubject$.next(this.formGroup?.controls[this.formName]?.value);
    this.formDataSubject$.next(this.data ?? []);
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
  }

  public onSelected(item: MultiSelectDropdownItem<T>) {
    this.selected.emit(item);
  }
}
