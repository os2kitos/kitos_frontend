import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox-button',
  templateUrl: './checkbox-button.component.html',
  styleUrl: './checkbox-button.component.scss'
})
export class CheckboxButtonComponent {
  value: boolean = false;

  @Output() valueChange = new EventEmitter<boolean>();

  public onButtonClick(): void {
    this.value = !this.value;
    this.emitValue();
  }

  private emitValue(): void {
    this.valueChange.emit(this.value);
  }

}
