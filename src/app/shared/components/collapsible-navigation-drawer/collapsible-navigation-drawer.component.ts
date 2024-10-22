import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-collapsible-navigation-drawer',
  templateUrl: './collapsible-navigation-drawer.component.html',
  styleUrl: './collapsible-navigation-drawer.component.scss'
})
export class CollapsibleNavigationDrawerComponent {
  @Input() items: NavigationDrawerItem[] = [];

  public isExpanded = false;
}

export interface NavigationDrawerItem {
  label: string;
  icon: string;
  route: string;
}
