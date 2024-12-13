import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { NavigationDrawerItem } from 'src/app/shared/components/navigation-drawer/navigation-drawer.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import {
  selectShowDataProcessingRegistrations,
  selectShowItContractModule,
  selectShowItSystemModule,
} from 'src/app/store/organization/selectors';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrl: './notification-details.component.scss',
})
export class NotificationDetailsComponent {
  public readonly navItems: NavigationDrawerItem[] = [
    {
      label: $localize`IT System`,
      iconType: 'systems',
      route: AppPath.itSystems,
      enabled$: this.store.select(selectShowItSystemModule),
    },
    {
      label: $localize`IT Kontrakt`,
      iconType: 'clipboard',
      route: AppPath.itContracts,
      enabled$: this.store.select(selectShowItContractModule),
    },
    {
      label: $localize`Databehandling`,
      iconType: 'folder-important',
      route: AppPath.dataProcessing,
      enabled$: this.store.select(selectShowDataProcessingRegistrations),
    },
  ];

  constructor(private store: Store) {}
}
