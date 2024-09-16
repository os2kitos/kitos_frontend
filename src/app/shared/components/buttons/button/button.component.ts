import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonStyle } from 'src/app/shared/models/buttons/button-style.model';

export declare type ThemePalette = 'primary' | 'accent' | 'warn' | 'secondary' | undefined;

@Component({
  selector: 'app-button',
  templateUrl: 'button.component.html',
  styleUrls: ['button.component.scss'],
})
export class ButtonComponent {
  @Input() public buttonStyle: ButtonStyle = 'primary';
  @Input() public color: ThemePalette = 'primary';
  @Input() public size: 'small' | 'medium' | 'large' = 'medium';
  @Input() public disabled = false;
  @Input() public loading: boolean | null = false;
  @Input() public type: 'button' | 'submit' = 'button';
  @Input() public tooltip?: string | null;

  @Output() buttonClick = new EventEmitter();

  public onButtonClick() {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit();
    }
  }
}
