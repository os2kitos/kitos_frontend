import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValidatedValueChange } from '../models/validated-value-change.model';
import { BaseComponent } from './base.component';

@Component({
  template: '',
})
export class BaseFormComponent<T> extends BaseComponent implements OnInit {
  @Input() public text = '';
  @Input() public disabled = false;

  @Input() public formGroup?: FormGroup;
  @Input() public formName: string | null = null;

  @Input() public value?: T;
  @Output() public valueChange = new EventEmitter<T | undefined>();
  @Output() public validatedValueChange = new EventEmitter<ValidatedValueChange<T | undefined>>();

  protected focused = false;
  protected hasChangedSinceLastBlur = false;

  ngOnInit() {
    this.avoidFocusedFormUpdate();
  }

  public formValueChange(value: T) {
    this.hasChangedSinceLastBlur = true;
    this.value = value;
  }

  public focus(focused: boolean) {
    this.focused = focused;

    // Emit both value and form validated value on blur if value has changed
    if (!focused && this.hasChangedSinceLastBlur && this.formName) {
      this.hasChangedSinceLastBlur = false;

      const valid = this.formGroup?.controls[this.formName]?.valid ?? true;
      this.validatedValueChange.emit({ value: this.value, text: this.text, valid });
      this.valueChange.emit(this.value);
    }
  }

  private avoidFocusedFormUpdate() {
    // This fix should only be applied on forms which updates on blur
    if (!this.formName || this.formGroup?.updateOn !== 'blur') return;

    // If user is typing in an input field when the form updates, the user input will be overwritten by the
    // old form value for this field. To avoid this we need to reapply the previous input value when a form
    // update comes in if it differs from the new value and the input is focused.
    this.subscriptions.add(
      this.formGroup?.controls[this.formName]?.valueChanges.subscribe((value) => {
        if (this.formName && this.focused && this.value !== value && this.value !== undefined) {
          this.formGroup?.controls[this.formName]?.setValue(this.value);
        }
      })
    );
  }
}
