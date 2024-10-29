import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { IconType } from '../../models/icon-type';

@Component({
  selector: 'app-navigation-drawer',
  templateUrl: './navigation-drawer.component.html',
  styleUrl: './navigation-drawer.component.scss',
})
export class NavigationDrawerComponent {
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
  dataCy?: string;
  enabled$?: Observable<boolean>;
}
