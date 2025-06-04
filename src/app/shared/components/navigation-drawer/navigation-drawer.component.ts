import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { IconType } from '../../models/icon-type';
import { ButtonComponent } from '../buttons/button/button.component';
import { CardComponent } from '../card/card.component';
import { DividerComponent } from '../divider/divider.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-navigation-drawer',
  templateUrl: './navigation-drawer.component.html',
  styleUrl: './navigation-drawer.component.scss',
  imports: [
    CommonModule,
    CardComponent,
    ButtonComponent,
    RouterLinkActive,
    RouterLink,
    IconComponent,
    DividerComponent,
  ],
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
