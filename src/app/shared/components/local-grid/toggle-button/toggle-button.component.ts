import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconButtonComponent } from '../../buttons/icon-button/icon-button.component';
import { NgIf } from '@angular/common';
import { XIconComponent } from '../../icons/x-icon.component';
import { CheckIconComponent } from '../../icons/check-icon.component';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrl: './toggle-button.component.scss',
  imports: [IconButtonComponent, NgIf, XIconComponent, CheckIconComponent],
})
export class ToggleButtonComponent {
  @Input() value!: boolean;

  @Output() valueChange = new EventEmitter<boolean>();

  public onToggle(): void {
    this.valueChange.emit(!this.value);
  }
}
