import { Component, Input } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { BaseFormComponent } from '../../base/base-form.component';
import { DEFAULT_DATE_FORMAT } from '../../constants';

@Component({
  selector: 'app-datepicker',
  templateUrl: 'datepicker.component.html',
  styleUrls: ['datepicker.component.scss'],
})
export class DatePickerComponent extends BaseFormComponent<Date | undefined> {
  @Input() public icon?: 'search';
  @Input() public size: 'medium' | 'large' = 'large';
  @Input() public pickerAlignmentY: 'above' | 'below' = 'above';
  @Input() override value: Date | undefined = undefined;

  public readonly DEFAULT_DATE_FORMAT = DEFAULT_DATE_FORMAT;

  public formDateInputValueChange(event: MatDatepickerInputEvent<moment.Moment, unknown>) {
    const newValue = this.extractDate(event);
    super.formValueChange(newValue);
  }

  private toUtcDate(date: moment.Moment) {
    const converted = new Date(Date.UTC(date.year(), date.month(), date.date(), 0, 0, 0, 0));
    return converted;
  }

  private extractDate(event: MatDatepickerInputEvent<moment.Moment, unknown>): Date | undefined {
    return event.value ? this.toUtcDate(moment(event.value)) : undefined;
  }

  public dateInputChanged(event: MatDatepickerInputEvent<moment.Moment, unknown>) {
    const newValue = this.extractDate(event);
    this.valueChange.emit(newValue);
  }
}
