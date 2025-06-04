import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipComponent } from '../../tooltip/tooltip.component';
import { ButtonComponent } from '../button/button.component';
import { NgClass } from '@angular/common';
import { CheckboxComponent } from '../../checkbox/checkbox.component';

@Component({
  selector: 'app-checkbox-button',
  templateUrl: './checkbox-button.component.html',
  styleUrl: './checkbox-button.component.scss',
  imports: [TooltipComponent, ButtonComponent, NgClass, CheckboxComponent],
})
export class CheckboxButtonComponent {
  @Input() value: boolean = false;
  @Input() disabled: boolean = false;
  @Input() backgroundWhite: boolean = false;
  @Input() isLarge: boolean = false;
  @Input() tooltip?: string;

  @Output() valueChange = new EventEmitter<boolean>();

  public onButtonClick(): void {
    this.value = !this.value;
    this.emitValue();
  }

  private emitValue(): void {
    this.valueChange.emit(this.value);
  }
}
