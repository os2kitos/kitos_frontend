import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-button',
  templateUrl: 'button.component.html',
  styleUrls: ['button.component.scss'],
})
export class ButtonComponent {
  @Input() public buttonStyle: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input() public color: ThemePalette = 'primary';
  @Input() public faded = false;
  @Input() public disabled = false;
  @Input() public loading: boolean | null = false;
  @Input() public type: 'button' | 'submit' = 'button';

  @Output() buttonClick = new EventEmitter();

  public onButtonClick() {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit();
    }
  }
}
