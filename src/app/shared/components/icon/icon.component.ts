import { Component, Input } from '@angular/core';
import { IconType } from '../../models/icon-type';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  @Input() iconType!: IconType;
}
