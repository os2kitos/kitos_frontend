import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-menu-button-item',
  templateUrl: './menu-button-item.component.html',
  styleUrls: ['./menu-button-item.component.scss']
})
export class MenuButtonItemComponent {
  @Input() disabled: boolean = false;
  @Output() itemClick = new EventEmitter();

  onClick() {
    if (!this.disabled) {
      this.itemClick.emit();
    }
  }
}
