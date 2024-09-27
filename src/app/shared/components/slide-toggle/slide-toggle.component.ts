import { Component, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { BaseFormComponent } from '../../base/base-form.component';

@Component({
  selector: 'app-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrl: './slide-toggle.component.scss',
})
export class SlideToggleComponent extends BaseFormComponent<boolean> {
  @Input() labelPosition: 'before' | 'after' = 'before';
  @Input() public color: ThemePalette = undefined;
  @Input() invertCheckedValue: boolean = false;

  public toggle(value: boolean) {
    this.formValueChange(value);
    this.valueChange.emit(value);
  }
}
