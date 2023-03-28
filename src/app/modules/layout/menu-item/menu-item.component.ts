import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppPath } from 'src/app/shared/enums/app-path';

@Component({
  selector: 'app-menu-item',
  templateUrl: 'menu-item.component.html',
  styleUrls: ['menu-item.component.scss'],
})
export class MenuItemComponent {
  @Input() path?: AppPath;

  @Output() itemClick = new EventEmitter();
}
