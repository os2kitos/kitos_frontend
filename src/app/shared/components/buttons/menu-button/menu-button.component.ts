import { Component, Input } from '@angular/core';
import { ButtonStyle } from '../button/button.component';

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrl: './menu-button.component.scss'
})
export class MenuButtonComponent {
  @Input() title?: string | null = '';
  @Input() buttonStyle: ButtonStyle = 'primary';
  @Input() iconType: IconType = undefined;
}

export type IconType = 'export' | 'dots' | undefined;
