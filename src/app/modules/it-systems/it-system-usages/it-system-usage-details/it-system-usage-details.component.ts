import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, filter, first, map, tap } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { NavigationDrawerItem } from 'src/app/shared/components/navigation-drawer/navigation-drawer.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { combineAND, mapUIConfigStatusToEnabled } from 'src/app/shared/helpers/observable-helpers';
import { BreadCrumb } from 'src/app/shared/models/breadcrumbs/breadcrumb.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { DialogOpenerService } from 'src/app/shared/services/dialog-opener.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { RegistrationRecommendedBadgesService } from 'src/app/shared/services/registration-recommended-badges.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectITSystemUsageHasDeletePermission,
  selectITSystemUsageHasReadPermission,
  selectIsSystemUsageLoading,
  selectItSystemUsageName,
  selectItSystemUsageSystemContextUuid,
  selectItSystemUsageUuid,
} from 'src/app/store/it-system-usage/selectors';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import {
  selectShowDataProcessingRegistrations,
  selectShowItContractModule,
} from 'src/app/store/organization/selectors';
import {
  selectITSystemUsageEnableAndRecommendedContracts,
  selectITSystemUsageEnableAndRecommendedDataProcessing,
  selectITSystemUsageEnableAndRecommendedGdpr,
  selectITSystemUsageEnableAndRecommendedLocalReferences,
  selectITSystemUsageEnableAndRecommendedSystemRelations,
  selectITSystemUsageEnableAndRecommendedTabArchiving,
  selectITSystemUsageEnableAndRecommendedTabHierarchy,
  selectITSystemUsageEnableAndRecommendedTabInterfaces,
  selectITSystemUsageEnableAndRecommendedTabLocalKle,
  selectITSystemUsageEnableAndRecommendedTabNotifications,
  selectITSystemUsageEnableAndRecommendedTabOrganization,
  selectITSystemUsageEnableAndRecommendedTabSystemRoles,
  selectITSystemUsageEnableAndRecommendedUsageArchive,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';
import { BreadcrumbsComponent } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { NavigationDrawerComponent } from '../../../../shared/components/navigation-drawer/navigation-drawer.component';

@Component({
  templateUrl: 'it-system-usage-details.component.html',
  styleUrls: ['it-system-usage-details.component.scss'],
  imports: [
    BreadcrumbsComponent,
    ButtonComponent,
    NavigationDrawerComponent,
    RouterOutlet,
    LoadingComponent,
    AsyncPipe,
  ],
})
export class ITSystemUsageDetailsComponent extends BaseComponent implements OnInit, OnDestroy {
  public readonly AppPath = AppPath;

  public readonly isLoading$ = this.store.select(selectIsSystemUsageLoading);
  public readonly organizationName$ = this.store.select(selectOrganizationName).pipe(filterNullish());
  public readonly itSystemUsageName$ = this.store.select(selectItSystemUsageName).pipe(filterNullish());
  public readonly itSystemUsageUuid$ = this.store.select(selectItSystemUsageUuid).pipe(filterNullish());
  public readonly hasDeletePermissions$ = this.store.select(selectITSystemUsageHasDeletePermission);

  public readonly enabledContractsTab$ = this.store
    .select(selectITSystemUsageEnableAndRecommendedContracts)
    .pipe(mapUIConfigStatusToEnabled());
  public readonly enabledDataProcessingTab$ = this.store
    .select(selectITSystemUsageEnableAndRecommendedDataProcessing)
    .pipe(mapUIConfigStatusToEnabled());
  public readonly enableGdprTab$ = this.store
    .select(selectITSystemUsageEnableAndRecommendedGdpr)
    .pipe(mapUIConfigStatusToEnabled());
  public readonly enableSystemRolesTab$ = this.store
    .select(selectITSystemUsageEnableAndRecommendedTabSystemRoles)
    .pipe(mapUIConfigStatusToEnabled());
  public readonly enableOrganizationTab$ = this.store
    .select(selectITSystemUsageEnableAndRecommendedTabOrganization)
    .pipe(mapUIConfigStatusToEnabled());
  public readonly enableSystemRelationsTab$ = this.store
    .select(selectITSystemUsageEnableAndRecommendedSystemRelations)
    .pipe(mapUIConfigStatusToEnabled());
  public readonly enableInterfacesTab$ = this.store
    .select(selectITSystemUsageEnableAndRecommendedTabInterfaces)
    .pipe(mapUIConfigStatusToEnabled());
  public readonly enableArchivingTab$ = this.store
    .select(selectITSystemUsageEnableAndRecommendedTabArchiving)
    .pipe(mapUIConfigStatusToEnabled());
  public readonly enableHierarchyTab$ = this.store
    .select(selectITSystemUsageEnableAndRecommendedTabHierarchy)
    .pipe(mapUIConfigStatusToEnabled());
  public readonly enableLocalKleTab$ = this.store
    .select(selectITSystemUsageEnableAndRecommendedTabLocalKle)
    .pipe(mapUIConfigStatusToEnabled());
  public readonly enableNotificationsTab$ = this.store
    .select(selectITSystemUsageEnableAndRecommendedTabNotifications)
    .pipe(mapUIConfigStatusToEnabled());
  public readonly enableLocalReferencesTab$ = this.store
    .select(selectITSystemUsageEnableAndRecommendedLocalReferences)
    .pipe(mapUIConfigStatusToEnabled());
  public readonly enableUsageArchive$ = this.store
    .select(selectITSystemUsageEnableAndRecommendedUsageArchive)
    .pipe(mapUIConfigStatusToEnabled());

  public readonly itContractsModuleEnabled$ = this.store.select(selectShowItContractModule);
  public readonly dataProcessingModuleEnabled$ = this.store.select(selectShowDataProcessingRegistrations);

  private readonly recommendedTabBadges = this.recommendedBadgesService.usage;

  public readonly breadCrumbs$ = combineLatest([
    this.organizationName$,
    this.itSystemUsageName$,
    this.itSystemUsageUuid$,
  ]).pipe(
    map(([organizationName, itSystemUsageName, systemUsageUuid]): BreadCrumb[] => [
      {
        text: $localize`IT Systemer i ${organizationName}`,
        routerLink: `${AppPath.itSystems}/${AppPath.itSystemUsages}`,
      },
      {
        text: itSystemUsageName,
        routerLink: `${systemUsageUuid}`,
      },
    ]),
    filterNullish(),
  );

  public readonly navigationItems: NavigationDrawerItem[] = [
    {
      label: $localize`Systemforside`,
      iconType: 'document',
      route: AppPath.frontpage,
      recommendedBadge$: this.recommendedTabBadges.frontpage$,
    },
    {
      label: $localize`Kontrakter`,
      iconType: 'clipboard',
      route: AppPath.itContracts,
      recommendedBadge$: this.recommendedTabBadges.contracts$,
      enabled$: combineAND([this.itContractsModuleEnabled$, this.enabledContractsTab$]),
    },
    {
      label: $localize`Databehandling`,
      iconType: 'folder-important',
      route: AppPath.dataProcessing,
      enabled$: combineAND([this.dataProcessingModuleEnabled$, this.enabledDataProcessingTab$]),
    },
    {
      label: $localize`GDPR`,
      iconType: 'lock',
      route: AppPath.gdpr,
      enabled$: this.enableGdprTab$,
      recommendedBadge$: this.recommendedTabBadges.gdpr$,
    },
    {
      label: $localize`Systemroller`,
      iconType: 'roles',
      route: AppPath.roles,
      recommendedBadge$: this.recommendedTabBadges.roles$,
      enabled$: this.enableSystemRolesTab$,
    },
    {
      label: $localize`Organisation`,
      iconType: 'organization',
      route: AppPath.organization,
      enabled$: this.enableOrganizationTab$,
    },
    {
      label: $localize`Relationer`,
      iconType: 'intersect',
      route: AppPath.relations,
      recommendedBadge$: this.recommendedTabBadges.relations$,
      enabled$: this.enableSystemRelationsTab$,
    },
    {
      label: $localize`Udstillede snitflader`,
      iconType: 'systems',
      route: AppPath.itInterfaces,
      enabled$: this.enableInterfacesTab$,
    },
    {
      label: $localize`Arkivering`,
      iconType: 'archive',
      route: AppPath.archiving,
      enabled$: this.enableArchivingTab$,
      recommendedBadge$: this.recommendedTabBadges.archiving$,
    },
    {
      label: $localize`Hierarki`,
      iconType: 'hierarchy',
      route: AppPath.hierarchy,
      enabled$: this.enableHierarchyTab$,
    },
    {
      label: $localize`Lokale KLE`,
      iconType: 'table',
      route: AppPath.kle,
      recommendedBadge$: this.recommendedTabBadges.localKle$,
      enabled$: this.enableLocalKleTab$,
    },
    {
      label: $localize`Advis`,
      iconType: 'notification',
      route: AppPath.notifications,
      recommendedBadge$: this.recommendedTabBadges.notifications$,
      enabled$: this.enableNotificationsTab$,
    },
    {
      label: $localize`Lokale referencer`,
      iconType: 'bookmark',
      route: AppPath.externalReferences,
      recommendedBadge$: this.recommendedTabBadges.references$,
      enabled$: this.enableLocalReferencesTab$,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private actions$: Actions,
    private notificationService: NotificationService,
    private dialogOpenerService: DialogOpenerService,
    private readonly recommendedBadgesService: RegistrationRecommendedBadgesService,
  ) {
    super();
  }

  ngOnInit() {
    this.subscriptions.add(
      this.route.params
        .pipe(
          map((params) => params['uuid']),
          distinctUntilChanged(), //Ensures we get changes if navigation occurs between usages
        )
        .subscribe((itSystemUsageUuid) => {
          this.store.dispatch(ITSystemUsageActions.getITSystemUsagePermissions(itSystemUsageUuid));
          this.store.dispatch(ITSystemUsageActions.getITSystemUsage(itSystemUsageUuid));
        }),
    );

    // Navigate to IT System Usages if user does not have read persmission to ressource
    this.subscriptions.add(
      this.store
        .select(selectITSystemUsageHasReadPermission)
        .pipe(filter((hasReadPermission) => hasReadPermission === false))
        .subscribe(() => {
          this.notificationService.showError($localize`Du har ikke læseadgang til dette IT System`);
          this.router.navigate([`${AppPath.itSystems}/${AppPath.itSystemUsages}`]);
        }),
    );

    // Navigate to IT System Usages if ressource does not exist
    this.subscriptions.add(
      this.actions$.pipe(ofType(ITSystemUsageActions.getITSystemUsageError)).subscribe(() => {
        this.notificationService.showError($localize`IT System findes ikke`);
        this.router.navigate([`${AppPath.itSystems}/${AppPath.itSystemUsages}`]);
      }),
    );

    // Load the catalog system as it is used across several different pages
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageSystemContextUuid)
        .pipe(filterNullish(), distinctUntilChanged())
        .subscribe((systemContextUuid) => this.store.dispatch(ITSystemActions.getITSystem(systemContextUuid))),
    );
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.store.dispatch(ITSystemUsageActions.getITSystemUsagePermissionsSuccess());
    this.store.dispatch(ITSystemUsageActions.getITSystemUsageSuccess());
  }

  public handleArchiveClick() {
    this.itSystemUsageUuid$.pipe(filterNullish(), first()).subscribe((itSystemUsageUuid) => {
      this.dialogOpenerService.openArchiveSystemUsageDialog(itSystemUsageUuid);
    });
  }

  public showRemoveDialog() {
    this.subscriptions.add(
      combineLatest([this.organizationName$.pipe(first()), this.enableUsageArchive$.pipe(first())])
        .pipe(
          tap(([organizationName, enableUsageArchive]) => {
            const confirmationDialogRef = this.dialogOpenerService.openTakeSystemOutOfUseDialog({
              organizationName,
              extraAction: enableUsageArchive ? this.handleArchiveClick.bind(this) : undefined,
            });

            this.subscriptions.add(
              this.actions$.pipe(ofType(ITSystemUsageActions.removeITSystemUsageSuccess), first()).subscribe(() => {
                confirmationDialogRef.close();
                this.router.navigate([`/${AppPath.itSystems}/${AppPath.itSystemUsages}`]);
              }),
            );

            this.subscriptions.add(
              confirmationDialogRef
                .afterClosed()
                .pipe(first())
                .subscribe((result) => {
                  if (result) {
                    this.store.dispatch(ITSystemUsageActions.removeITSystemUsage());
                  }
                }),
            );

            this.subscriptions.add(
              this.actions$.pipe(ofType(ITSystemUsageActions.archiveItSystemUsageSuccess), first()).subscribe(() => {
                confirmationDialogRef.close();
                this.router.navigate([`/${AppPath.itSystems}/${AppPath.itSystemUsages}`]);
              }),
            );

            this.subscriptions.add(
              this.actions$.pipe(ofType(ITSystemUsageActions.archiveItSystemUsageError), first()).subscribe(() => {}),
            );
          }),
        )
        .subscribe(),
    );
  }
}
