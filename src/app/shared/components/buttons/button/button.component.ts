import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { ButtonStyle } from 'src/app/shared/models/buttons/button-style.model';
import { IconType } from 'src/app/shared/models/icon-type';
import { CtrlClickDirective } from '../../../directives/ctrl-click.directive';
import { IconComponent } from '../../icon/icon.component';
import { TooltipComponent } from '../../tooltip/tooltip.component';

export declare type ExtendedThemePalette = ThemePalette | 'secondary';

@Component({
  selector: 'app-button',
  templateUrl: 'button.component.html',
  styleUrls: ['button.component.scss'],
  imports: [TooltipComponent, MatButton, CtrlClickDirective, CommonModule, IconComponent],
})
export class ButtonComponent {
  @Input() public buttonStyle: ButtonStyle = 'primary';
  @Input() public color: ExtendedThemePalette = 'primary';
  @Input() public size: 'x-small' | 'small' | 'medium' | 'large' = 'medium';
  @Input() public disabled = false;
  @Input() public loading: boolean | null = false;
  @Input() public type: 'button' | 'submit' = 'button';
  @Input() public tooltip?: string | null;
  @Input() public tooltipMatchContentWidth: boolean = false;
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
