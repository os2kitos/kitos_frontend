import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DateInputFillMode } from '@progress/kendo-angular-dateinputs';
import { DEFAULT_DATE_FORMAT } from '../../constants';
import { ValidatedValueChange } from '../../models/validated-value-change.model';

@Component({
  selector: 'app-datepicker',
  templateUrl: 'datepicker.component.html',
  styleUrls: ['datepicker.component.scss'],
})
export class DatePickerComponent {
  @Input() public text = '';
  @Input() public disabled = false;
  @Input() public icon?: 'search';
  @Input() public size: 'small' | 'large' = 'large';

  @Input() public formGroup?: FormGroup;
  @Input() public formName: string | null = null;

  @Input() public value: Date = new Date();
  @Output() public valueChange = new EventEmitter<Date | undefined>();
  @Output() public validatedValueChange = new EventEmitter<ValidatedValueChange<Date | undefined>>();

  public readonly fillMode: DateInputFillMode = 'outline';

  public readonly DEFAULT_DATE_FORMAT = DEFAULT_DATE_FORMAT;

  private hasChangedSinceLastBlur = false;

  public formValueChange(value: Date) {
    this.hasChangedSinceLastBlur = true;
    this.value = value;
  }

  public formBlur() {
    if (!this.hasChangedSinceLastBlur || !this.formName) return;
    this.hasChangedSinceLastBlur = false;

    const valid = this.formGroup?.controls[this.formName]?.valid ?? true;
    this.validatedValueChange.emit({ value: this.value, text: this.text, valid });
    this.valueChange.emit(this.value);
  }
}
