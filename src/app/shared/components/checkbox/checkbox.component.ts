import { Component, Input } from '@angular/core';
import { BaseFormComponent } from '../../base/base-form.component';
import { ThemePalette } from '@angular/material/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-checkbox',
  templateUrl: 'checkbox.component.html',
  styleUrls: ['checkbox.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, TooltipComponent, MatCheckbox],
})
export class CheckboxComponent extends BaseFormComponent<boolean> {
  @Input() labelPosition: 'before' | 'after' = 'before';
  @Input() tooltip: string = '';
  @Input() public color: ThemePalette = undefined;
  @Input() invertCheckedValue: boolean = false;

  public toggle(value: boolean) {
    this.formValueChange(value);
    this.valueChange.emit(value);
  }
}
