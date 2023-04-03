import { Component, Input } from '@angular/core';
import { BaseFormComponent } from '../../base/base-form.component';

@Component({
  selector: 'app-checkbox',
  templateUrl: 'checkbox.component.html',
  styleUrls: ['checkbox.component.scss'],
})
export class CheckboxComponent extends BaseFormComponent<boolean> {
  @Input() labelPosition: 'before' | 'after' = 'before';
}
