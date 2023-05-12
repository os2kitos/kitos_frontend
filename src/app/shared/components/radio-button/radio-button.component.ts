import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseFormComponent } from '../../base/base-form.component';

export interface RadioButtonOption {
  uuid: string;
  label: string;
}

@Component({
  selector: 'app-radio-button[options]',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent extends BaseFormComponent<RadioButtonOption> {
  @Input() public title: string | undefined;
  @Input() public options!: Array<RadioButtonOption>;
  @Output() public optionChanged = new EventEmitter<string | undefined>();

  public changeSelectedOption(option?: string) {
    this.optionChanged.emit(option);
  }
}
