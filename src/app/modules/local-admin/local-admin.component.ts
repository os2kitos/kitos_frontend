import { Component } from '@angular/core';
import { NavigationDrawerItem } from 'src/app/shared/components/collapsible-navigation-drawer/collapsible-navigation-drawer.component';
import { AppPath } from 'src/app/shared/enums/app-path';

@Component({
  selector: 'app-local-admin',
  templateUrl: './local-admin.component.html',
  styleUrl: './local-admin.component.scss',
})
export class LocalAdminComponent {
  public readonly AppPath = AppPath;

  public readonly items: NavigationDrawerItem[] = [
    {
      label: 'Information',
      icon: 'document',
      route: AppPath.information,
    },
    {
      label: 'Organisation',
      icon: 'organization',
      route: AppPath.organization,
    }
  ];
}
