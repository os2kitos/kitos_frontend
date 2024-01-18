import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseFormComponent } from '../../base/base-form.component';

export interface RadioButtonOption<TOptionIdType> {
  id: TOptionIdType;
  label: string;
}

@Component({
  selector: 'app-radio-buttons[options]',
  templateUrl: './radio-buttons.component.html',
  styleUrls: ['./radio-buttons.component.scss'],
})
export class RadioButtonsComponent<TOptionIdType> extends BaseFormComponent<TOptionIdType> {
  @Input() public options!: Array<RadioButtonOption<TOptionIdType>>;
  @Output() public optionChanged = new EventEmitter<TOptionIdType>();

  public changeSelectedOption(value: TOptionIdType) {
    this.formValueChange(value);
    this.valueChange.emit(value);
    this.optionChanged.emit(value);
  }

  /* override avoidFocusedFormUpdate() {
    if (!this.formName || this.formGroup?.updateOn !== 'blur') return;

    this.subscriptions.add(
      this.formGroup?.controls[this.formName]?.valueChanges.subscribe((value) => {
        if (this.formName && this.focused && this.value !== value && this.value !== undefined) {
          this.formGroup?.controls[this.formName]?.setValue(Boolean(this.value));
        }
      })
    );
  } */
}
