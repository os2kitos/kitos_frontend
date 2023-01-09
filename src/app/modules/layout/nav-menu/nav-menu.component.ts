import { Component, Input } from '@angular/core';
import { NavMenuItem } from './nav-menu-item.model';

@Component({
  selector: 'app-nav-menu[items]',
  templateUrl: 'nav-menu.component.html',
  styleUrls: ['nav-menu.component.scss'],
})
export class NavMenuComponent {
  @Input() public items!: NavMenuItem[];
}
