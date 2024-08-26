import { Component, Input } from '@angular/core';
import { ButtonStyle } from 'src/app/shared/models/buttons/button-style.model';
import { IconType } from 'src/app/shared/models/buttons/icon-type';

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
