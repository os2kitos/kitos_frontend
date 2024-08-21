import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-menu-button-item',
  templateUrl: './menu-button-item.component.html',
  styleUrl: './menu-button-item.component.scss'
})
export class MenuButtonItemComponent {
  @Output() itemClick = new EventEmitter();
}
