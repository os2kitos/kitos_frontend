import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { SwitchComponent } from '@progress/kendo-angular-inputs';
import { BaseFormComponent } from '../../base/base-form.component';
import { ParagraphComponent } from '../paragraph/paragraph.component';
import { ParagraphFontSizeTypes } from '../../models/sizes/paragraph-font-sizes.model';

@Component({
  selector: 'app-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrl: './slide-toggle.component.scss',
  imports: [FormsModule, ReactiveFormsModule, SwitchComponent, ParagraphComponent],
})
export class SlideToggleComponent extends BaseFormComponent<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('switch') switch: any;
  @Input() labelPosition: 'before' | 'after' = 'before';
  @Input() public color: ThemePalette = undefined;
  @Input() invertCheckedValue: boolean = false;
  @Input() textSize: ParagraphFontSizeTypes = 'small';

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
