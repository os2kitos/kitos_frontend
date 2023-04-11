import { Component, Input } from '@angular/core';
import { BaseFormComponent } from '../../base/base-form.component';
import { DEFAULT_DATE_FORMAT } from '../../constants';

@Component({
  selector: 'app-datepicker',
  templateUrl: 'datepicker.component.html',
  styleUrls: ['datepicker.component.scss'],
})
export class DatePickerComponent extends BaseFormComponent<Date> {
  @Input() public icon?: 'search';
  @Input() public size: 'small' | 'large' = 'large';

  @Input() override value = new Date();

  public readonly DEFAULT_DATE_FORMAT = DEFAULT_DATE_FORMAT;
}
