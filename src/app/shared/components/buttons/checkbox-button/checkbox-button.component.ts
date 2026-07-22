import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckboxComponent } from '../../checkbox/checkbox.component';
import { TooltipComponent } from '../../tooltip/tooltip.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-checkbox-button',
  templateUrl: './checkbox-button.component.html',
  styleUrl: './checkbox-button.component.scss',
  imports: [TooltipComponent, ButtonComponent, NgClass, CheckboxComponent, NgTemplateOutlet],
})
export class CheckboxButtonComponent {
  @Input() value: boolean = false;
  @Input() disabled: boolean = false;
  @Input() backgroundWhite: boolean = false;
  @Input() isLarge: boolean = false;
  @Input() tooltip?: string;
  @Input() formName?: string;
  @Input() formGroup?: FormGroup;

  @Output() valueChange = new EventEmitter<boolean>();

  public onButtonClick(): void {
    if (this.formGroup && this.formName) {
      const control = this.formGroup.get(this.formName);
      if (control) {
        control.setValue(!control.value);
      }
    }
    this.value = !this.value;
    this.emitValue();
  }

  private emitValue(): void {
    this.valueChange.emit(this.value);
  }
}
