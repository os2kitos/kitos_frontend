import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { BaseModuleComponent } from 'src/app/shared/base/base-module-component';
import { NavigationDrawerItem } from 'src/app/shared/components/navigation-drawer/navigation-drawer.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { selectCurrentTabModuleKey } from 'src/app/store/local-admin/ui-root-config/selectors';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { selectShowDataProcessingRegistrations, selectShowItContractModule, selectShowItSystemModule } from 'src/app/store/organization/selectors';

@Component({
  selector: 'app-local-admin',
  templateUrl: './local-admin.component.html',
  styleUrl: './local-admin.component.scss',
})
export class LocalAdminComponent extends BaseModuleComponent {
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

  public readonly showItSystemModule$ = this.store.select(selectShowItSystemModule);
  public readonly showItContractModule$ = this.store.select(selectShowItContractModule);
  public readonly showDataProcessingRegistrations$ = this.store.select(selectShowDataProcessingRegistrations);
  public readonly currentTabModuleKey$ = this.store.select(selectCurrentTabModuleKey);

  public patchUIRootConfig($event: boolean) {
    this.subscriptions.add(
      this.currentTabModuleKey$.subscribe((moduleKey) => {
        const dtoFieldName = this.getDtoFieldName(moduleKey);
        this.store.dispatch(OrganizationActions.patchUIRootConfig({ dto: { [dtoFieldName]: $event } }));
      })
    );
  }

  getModuleTogglingButtonValue(moduleKey: UIModuleConfigKey | undefined): Observable<boolean | undefined> {
    switch (moduleKey) {
      case UIModuleConfigKey.ItSystemUsage:
        return this.showItSystemModule$;
      case UIModuleConfigKey.ItContract:
        return this.showItContractModule$;
      case UIModuleConfigKey.DataProcessingRegistrations:
        return this.showDataProcessingRegistrations$;
      default:
        return of(false);
    }
  }

  getModuleKeyDescription(moduleKey: UIModuleConfigKey | undefined): string {
    switch (moduleKey) {
      case UIModuleConfigKey.ItSystemUsage:
        return $localize`IT systemer`;
      case UIModuleConfigKey.DataProcessingRegistrations:
        return $localize`Databehandling`;
      case UIModuleConfigKey.ItContract:
        return $localize`IT Kontrakter`;
      default:
        return $localize`Ukendt modul`;
    }
  }

  getDtoFieldName(moduleKey: UIModuleConfigKey | undefined): string {
    switch (moduleKey) {
      case UIModuleConfigKey.ItSystemUsage:
        return 'showItSystemModule';
      case UIModuleConfigKey.DataProcessingRegistrations:
        return 'showDataProcessing';
      case UIModuleConfigKey.ItContract:
        return 'showItContractModule';
      default:
        return $localize`Ukendt modul`;
    }
  }
}
