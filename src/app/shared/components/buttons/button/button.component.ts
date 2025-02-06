import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ButtonStyle } from 'src/app/shared/models/buttons/button-style.model';
import { IconType } from 'src/app/shared/models/icon-type';

export declare type ExtendedThemePalette = ThemePalette | 'secondary';

@Component({
  selector: 'app-button',
  templateUrl: 'button.component.html',
  styleUrls: ['button.component.scss'],
})
export class ButtonComponent {
  @Input() public buttonStyle: ButtonStyle = 'primary';
  @Input() public color: ExtendedThemePalette = 'primary';
  @Input() public size: 'small' | 'medium' | 'large' = 'medium';
  @Input() public disabled = false;
  @Input() public loading: boolean | null = false;
  @Input() public type: 'button' | 'submit' = 'button';
  @Input() public tooltip?: string | null;
  @Input() public alignStart = false;
  @Input() public backgroundWhite = false;
  @Input() public iconType?: IconType;

  @Output() buttonClick = new EventEmitter();

  public onButtonClick() {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit();
    }
  }
}
