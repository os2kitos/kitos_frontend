import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter, map, Observable, of, startWith } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { NavigationDrawerItem } from 'src/app/shared/components/navigation-drawer/navigation-drawer.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { OrganizationActions } from 'src/app/store/organization/actions';
import {
  selectShowDataProcessingRegistrations,
  selectShowItContractModule,
  selectShowItSystemModule,
} from 'src/app/store/organization/selectors';
import { UIModuleConfigActions } from 'src/app/store/organization/ui-module-customization/actions';

interface ModuleTabInfo {
  text: string;
  enabled: Observable<boolean | undefined>;
  dtoFieldName: string;
}

@Component({
  selector: 'app-local-admin',
  templateUrl: './local-admin.component.html',
  styleUrl: './local-admin.component.scss',
})
export class LocalAdminComponent extends BaseComponent implements OnInit {
  public readonly AppPath = AppPath;

  public readonly showItSystemModule$ = this.store.select(selectShowItSystemModule);
  public readonly showItContractModule$ = this.store.select(selectShowItContractModule);
  public readonly showDataProcessingRegistrations$ = this.store.select(selectShowDataProcessingRegistrations);

  public currentTabPathSegment$: Observable<string> = of('');
  public currentTabModuleKey$: Observable<UIModuleConfigKey | undefined> = of(undefined);

  constructor(private store: Store, private router: Router) {
    super();
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

  public helpText = '';

  ngOnInit(): void {
    this.getUIModuleConfig();
    this.updateTabModuleKeyOnRouting();
  }

  public getCurrentTabModuleKey(urlSegment: string) {
    switch (urlSegment) {
      case AppPath.localAdminSystemUsages:
        return of(UIModuleConfigKey.ItSystemUsage);
      case AppPath.itContracts:
        return of(UIModuleConfigKey.ItContract);
      case AppPath.dataProcessing:
        return of(UIModuleConfigKey.DataProcessingRegistrations);
      default:
        return of(undefined);
    }
  }

  public patchUIRootConfig($event: boolean) {
    this.subscriptions.add(
      this.currentTabModuleKey$.subscribe((moduleKey) => {
        const moduleTabInfo = this.getModuleTabInfo(moduleKey);
        this.store.dispatch(OrganizationActions.patchUIRootConfig({ dto: { [moduleTabInfo.dtoFieldName]: $event } }));
      })
    );
  }

  public getModuleEnabled(moduleKey: UIModuleConfigKey | undefined): Observable<boolean | undefined> {
    const moduleTabInfo = this.getModuleTabInfo(moduleKey);
    return moduleTabInfo.enabled;
  }

  public getModuleText(moduleKey: UIModuleConfigKey | undefined): string {
    const moduleTabInfo = this.getModuleTabInfo(moduleKey);
    return moduleTabInfo.text;
  }

  private getUIModuleConfig() {
    this.store.dispatch(UIModuleConfigActions.getUIModuleConfig({ module: UIModuleConfigKey.ItSystemUsage }));
    this.store.dispatch(UIModuleConfigActions.getUIModuleConfig({ module: UIModuleConfigKey.ItContract }));
    this.store.dispatch(
      UIModuleConfigActions.getUIModuleConfig({ module: UIModuleConfigKey.DataProcessingRegistrations })
    );
  }

  private updateTabModuleKeyOnRouting() {
    this.currentTabPathSegment$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((navigationEnd) => this.extractLastUrlSegment(navigationEnd.urlAfterRedirects)),
      startWith(this.extractLastUrlSegment(this.router.url)),
      distinctUntilChanged()
    );
    this.subscriptions.add(
      this.currentTabPathSegment$.subscribe((segment) => {
        this.currentTabModuleKey$ = this.getCurrentTabModuleKey(segment);
        this.helpText = this.getCurrentTabHelpText(segment);
      })
    );
  }

  private getCurrentTabHelpText(urlSegment: string): string {
    switch (urlSegment) {
      case AppPath.information:
        return 'current-org';
      case AppPath.organization:
        return 'org';
      case AppPath.localAdminSystemUsages:
        return 'system';
      case AppPath.itContracts:
        return 'contract';
      case AppPath.dataProcessing:
        return 'data-processing';
      case AppPath.import:
        return 'import.organization';
      default:
        return '';
    }
  }
  private getModuleTabInfo(moduleKey: UIModuleConfigKey | undefined): ModuleTabInfo {
    switch (moduleKey) {
      case UIModuleConfigKey.ItSystemUsage:
        return {
          text: $localize`IT Systemer`,
          enabled: this.showItSystemModule$,
          dtoFieldName: 'showItSystemModule',
        };
      case UIModuleConfigKey.DataProcessingRegistrations:
        return {
          text: $localize`Databehandling`,
          enabled: this.showDataProcessingRegistrations$,
          dtoFieldName: 'showDataProcessing',
        };
      case UIModuleConfigKey.ItContract:
        return {
          text: $localize`IT Kontrakter`,
          enabled: this.showItContractModule$,
          dtoFieldName: 'showItContractModule',
        };
      default:
        return {
          text: $localize`Ukendt modul`,
          enabled: of(false),
          dtoFieldName: '',
        };
    }
  }

  private extractLastUrlSegment(url: string): string {
    const urlSegments = url.split('/');
    return urlSegments[urlSegments.length - 1];
  }
}
