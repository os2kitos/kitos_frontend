import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseModuleComponent } from 'src/app/shared/base/base-module-component';
import { NavigationDrawerItem } from 'src/app/shared/components/navigation-drawer/navigation-drawer.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { UIModuleConfigActions } from 'src/app/store/organization/ui-module-customization/actions';

@Component({
  selector: 'app-local-admin',
  templateUrl: './local-admin.component.html',
  styleUrl: './local-admin.component.scss',
})
export class LocalAdminComponent extends BaseModuleComponent implements OnInit {
  public readonly AppPath = AppPath;

  constructor(store: Store) {
    super(store);
  }

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
      route: AppPath.localAdminSystemUsages,
      dataCy: 'local-admin-it-system-button',
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
      label: $localize`Masseopret`,
      iconType: 'bulk-create',
      route: AppPath.import,
    },
  ];

  constructor(private store: Store) {}
  public ngOnInit(): void {
    this.store.dispatch(UIModuleConfigActions.getUIModuleConfig({ module: UIModuleConfigKey.ItSystemUsage }));
    this.store.dispatch(
      UIModuleConfigActions.getUIModuleConfig({ module: UIModuleConfigKey.DataProcessingRegistrations })
    );
  }
}
