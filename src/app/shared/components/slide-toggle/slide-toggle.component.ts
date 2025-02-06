import { Component, Input, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { BaseFormComponent } from '../../base/base-form.component';

@Component({
  selector: 'app-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrl: './slide-toggle.component.scss',
})
export class SlideToggleComponent extends BaseFormComponent<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('switch') switch: any;
  @Input() labelPosition: 'before' | 'after' = 'before';
  @Input() public color: ThemePalette = undefined;
  @Input() invertCheckedValue: boolean = false;

  public toggle(value: boolean) {
    this.formValueChange(value);
    this.valueChange.emit(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onParagraphClick(switchElement: any) {
    const value = !switchElement._checked;
    this.updateValue(value);
    this.toggle(value);
  }

  updateValue(value: boolean) {
    this.value = value;
    this.switch.writeValue(value);
  }
}
