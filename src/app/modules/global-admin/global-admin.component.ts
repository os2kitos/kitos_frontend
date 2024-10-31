import { Component } from '@angular/core';
import { NavigationDrawerItem } from 'src/app/shared/components/navigation-drawer/navigation-drawer.component';
import { AppPath } from 'src/app/shared/enums/app-path';

@Component({
  selector: 'app-global-admin',
  templateUrl: './global-admin.component.html',
  styleUrl: './global-admin.component.scss',
})
export class GlobalAdminComponent {
  public readonly globalAdminNavigationItems: NavigationDrawerItem[] = [
    {
      label: $localize`Organisationer`,
      iconType: 'roles',
      route: AppPath.organizations,
    },
    {
      label: $localize`Globale administratorer`,
      iconType: 'multiple-users',
      route: AppPath.globalAdmins,
    },
    {
      label: $localize`Lokale administratorer`,
      iconType: 'settings',
      route: AppPath.localAdmins,
    },
    {
      label: $localize`Organisation`,
      iconType: 'organization',
      route: AppPath.organization,
    },
    {
      label: $localize`IT System`,
      iconType: 'systems',
      route: AppPath.itSystems,
    },
    {
      label: $localize`IT Kontrakt`,
      iconType: 'clipboard',
      route: AppPath.itContracts,
    },
    {
      label: $localize`Databehandling`,
      iconType: 'folder-important',
      route: AppPath.dataProcessing,
    },
    {
      label: $localize`Andet`,
      iconType: 'dots',
      route: AppPath.other,
    },
    {
      label: $localize`Hjælpetekster`,
      iconType: 'help',
      route: AppPath.helpTexts,
    },
  ];
}
