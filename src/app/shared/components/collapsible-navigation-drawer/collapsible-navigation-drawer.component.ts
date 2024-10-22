import { Component, Input } from '@angular/core';
import { IconType } from '../../models/icon-type';

@Component({
  selector: 'app-collapsible-navigation-drawer',
  templateUrl: './collapsible-navigation-drawer.component.html',
  styleUrl: './collapsible-navigation-drawer.component.scss',
})
export class CollapsibleNavigationDrawerComponent {
  @Input() items: NavigationDrawerItem[] = [];

  public isExpanded = true;

  public toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }
}

export interface NavigationDrawerItem {
  label: string;
  iconType: IconType;
  route: string;
}
