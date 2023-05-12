import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseFormComponent } from '../../base/base-form.component';

export interface RadioButtonOption {
  uuid: string;
  label: string;
}

@Component({
  selector: 'app-radio-buttons[options]',
  templateUrl: './radio-buttons.component.html',
  styleUrls: ['./radio-buttons.component.scss'],
})
export class RadioButtonsComponent extends BaseFormComponent<RadioButtonOption> {
  @Input() public title: string | undefined;
  @Input() public options!: Array<RadioButtonOption>;
  @Output() public optionChanged = new EventEmitter<string | undefined>();

  public changeSelectedOption(option?: string) {
    this.optionChanged.emit(option);
  }
}
