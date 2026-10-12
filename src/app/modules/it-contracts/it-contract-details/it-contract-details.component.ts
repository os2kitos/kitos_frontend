import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, filter, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { NavigationDrawerItem } from 'src/app/shared/components/navigation-drawer/navigation-drawer.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { combineAND, mapUIConfigStatusToEnabled } from 'src/app/shared/helpers/observable-helpers';
import { BreadCrumb } from 'src/app/shared/models/breadcrumbs/breadcrumb.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { RegistrationRecommendedBadgesService } from 'src/app/shared/services/registration-recommended-badges.service';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import {
  selectContractLoading,
  selectItContractHasDeletePermissions,
  selectItContractHasReadPermissions,
  selectItContractName,
  selectItContractUuid,
} from 'src/app/store/it-contract/selectors';
import { selectShowDataProcessingRegistrations, selectShowItSystemModule } from 'src/app/store/organization/selectors';
import {
  selectItContractEnableAndRecommendedAdvis,
  selectItContractEnableAndRecommendedContractRoles,
  selectItContractEnableAndRecommendedDataProcessing,
  selectItContractEnableAndRecommendedDeadlines,
  selectItContractEnableAndRecommendedEconomy,
  selectItContractEnableAndRecommendedHierarchy,
  selectItContractEnableAndRecommendedItSystems,
  selectItContractEnableAndRecommendedReferences,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { BreadcrumbsComponent } from '../../../shared/components/breadcrumbs/breadcrumbs.component';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { NavigationDrawerComponent } from '../../../shared/components/navigation-drawer/navigation-drawer.component';
import { DeleteContractDialogComponent } from './delete-contract-dialog/delete-contract-dialog.component';

@Component({
  selector: 'app-it-contract-details',
  templateUrl: './it-contract-details.component.html',
  styleUrl: './it-contract-details.component.scss',
  imports: [
    BreadcrumbsComponent,
    ButtonComponent,
    NavigationDrawerComponent,
    RouterOutlet,
    LoadingComponent,
    AsyncPipe,
  ],
})
export class ItContractDetailsComponent extends BaseComponent implements OnInit, OnDestroy {
  public readonly AppPath = AppPath;

  public readonly isLoading$ = this.store.select(selectContractLoading);
  public readonly contractName$ = this.store.select(selectItContractName).pipe(filterNullish());
  public readonly contractUuid$ = this.store.select(selectItContractUuid).pipe(filterNullish());

  public readonly hasDeletePermission$ = this.store.select(selectItContractHasDeletePermissions);

  public readonly breadCrumbs$ = combineLatest([this.contractName$, this.contractUuid$]).pipe(
    map(([contractName, contractUuid]): BreadCrumb[] => [
      {
        text: $localize`IT Kontrakt`,
        routerLink: `${AppPath.itContracts}`,
      },
      {
        text: contractName,
        routerLink: `${contractUuid}`,
      },
    ]),
    filterNullish(),
  );
  public readonly itSystemsTabEnabled$ = this.store
    .select(selectItContractEnableAndRecommendedItSystems)
    .pipe(mapUIConfigStatusToEnabled());
  public readonly dataProcessingTabEnabled$ = this.store
    .select(selectItContractEnableAndRecommendedDataProcessing)
    .pipe(mapUIConfigStatusToEnabled());
  public readonly agreementDeadlinesTabEnabled$ = this.store
    .select(selectItContractEnableAndRecommendedDeadlines)
    .pipe(mapUIConfigStatusToEnabled());
  public readonly economyTabEnabled$ = this.store
    .select(selectItContractEnableAndRecommendedEconomy)
    .pipe(mapUIConfigStatusToEnabled());
  public readonly contractRolesTabEnabled$ = this.store
    .select(selectItContractEnableAndRecommendedContractRoles)
    .pipe(mapUIConfigStatusToEnabled());
  public readonly hierarchyTabEnabled$ = this.store
    .select(selectItContractEnableAndRecommendedHierarchy)
    .pipe(mapUIConfigStatusToEnabled());
  public readonly notificationsTabEnabled$ = this.store
    .select(selectItContractEnableAndRecommendedAdvis)
    .pipe(mapUIConfigStatusToEnabled());
  public readonly referenceTabEnabled$ = this.store
    .select(selectItContractEnableAndRecommendedReferences)
    .pipe(mapUIConfigStatusToEnabled());

  public readonly dataProcessingModuleEnabled$ = this.store.select(selectShowDataProcessingRegistrations);
  public readonly itSystemsModuleEnabled$ = this.store.select(selectShowItSystemModule);

  private readonly recommendedTabBadges = this.recommendedBadgesService.contract;

  public readonly navigationItems: NavigationDrawerItem[] = [
    {
      label: $localize`Kontraktforside`,
      iconType: 'document',
      route: AppPath.frontpage,
      recommendedBadge$: this.recommendedTabBadges.frontpage$,
    },
    {
      label: $localize`IT Systemer`,
      iconType: 'systems',
      route: AppPath.itSystems,
      recommendedBadge$: this.recommendedTabBadges.itSystems$,
      enabled$: combineAND([this.itSystemsModuleEnabled$, this.itSystemsTabEnabled$]),
    },
    {
      label: $localize`Databehandling`,
      iconType: 'folder-important',
      route: AppPath.dataProcessing,
      recommendedBadge$: this.recommendedTabBadges.dataProcessing$,
      enabled$: combineAND([this.dataProcessingModuleEnabled$, this.dataProcessingTabEnabled$]),
    },
    {
      label: $localize`Aftalefrister`,
      iconType: 'clipboard',
      route: AppPath.agreementDeadlines,
      enabled$: this.agreementDeadlinesTabEnabled$,
      recommendedBadge$: this.recommendedTabBadges.deadlines$,
    },
    {
      label: $localize`Økonomi`,
      iconType: 'money',
      route: AppPath.economy,
      enabled$: this.economyTabEnabled$,
      recommendedBadge$: this.recommendedTabBadges.economy$,
    },
    {
      label: $localize`Kontraktroller`,
      iconType: 'roles',
      route: AppPath.roles,
      recommendedBadge$: this.recommendedTabBadges.roles$,
      enabled$: this.contractRolesTabEnabled$,
    },
    {
      label: $localize`Hierarki`,
      iconType: 'organization',
      route: AppPath.hierarchy,
      enabled$: this.hierarchyTabEnabled$,
    },
    {
      label: $localize`Advis`,
      iconType: 'notification',
      route: AppPath.notifications,
      recommendedBadge$: this.recommendedTabBadges.notifications$,
      enabled$: this.notificationsTabEnabled$,
    },
    {
      label: $localize`Referencer`,
      iconType: 'bookmark',
      route: AppPath.externalReferences,
      recommendedBadge$: this.recommendedTabBadges.references$,
      enabled$: this.referenceTabEnabled$,
    },
  ];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private actions$: Actions,
    private dialog: MatDialog,
    private readonly recommendedBadgesService: RegistrationRecommendedBadgesService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToUuidNavigation();
    this.checkResourceExists();
    this.verifyPermissions();

    this.subscriptions.add(
      this.actions$.pipe(ofType(ITContractActions.deleteITContractSuccess)).subscribe(() => {
        this.dialog.closeAll();
        this.router.navigate([`${AppPath.itContracts}`]);
      }),
    );
  }

  public showDeleteDialog(): void {
    this.dialog.open(DeleteContractDialogComponent);
  }

  private subscribeToUuidNavigation(): void {
    this.subscriptions.add(
      this.route.params
        .pipe(
          map((params) => params['uuid']),
          distinctUntilChanged(),
        )
        .subscribe((itContractUuid) => {
          this.store.dispatch(ITContractActions.getITContractPermissions(itContractUuid));
          this.store.dispatch(ITContractActions.getITContract(itContractUuid));
        }),
    );
  }

  private verifyPermissions() {
    // Navigate to IT Contract if user does not have read permission to the resource
    this.subscriptions.add(
      this.store
        .select(selectItContractHasReadPermissions)
        .pipe(filter((hasReadPermission) => hasReadPermission === false))
        .subscribe(() => {
          this.notificationService.showError($localize`Du har ikke læseadgang til denne IT Kontrakt`);
          this.router.navigate([`${AppPath.itContracts}`]);
        }),
    );
  }

  private checkResourceExists() {
    this.subscriptions.add(
      this.actions$.pipe(ofType(ITContractActions.getITContractError)).subscribe(() => {
        this.notificationService.showError($localize`IT Kontrakt findes ikke`);
        this.router.navigate([`${AppPath.itContracts}`]);
      }),
    );
  }
}
