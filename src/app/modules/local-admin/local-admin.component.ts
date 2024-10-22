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
      label: $localize`Information`,
      iconType: 'document',
      route: AppPath.information,
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
    },{
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
      label: $localize`Masseopret`,
      iconType: 'bulk-create',
      route: AppPath.import,
    },
  ];
}
