import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, filter, first, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { NavigationDrawerItem } from 'src/app/shared/components/navigation-drawer/navigation-drawer.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { combineBooleansWithAnd } from 'src/app/shared/helpers/observable-helpers';
import { BreadCrumb } from 'src/app/shared/models/breadcrumbs/breadcrumb.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import {
  selectDataProcessingHasDeletePermissions,
  selectDataProcessingHasReadPermissions,
  selectDataProcessingLoading,
  selectDataProcessingName,
  selectDataProcessingUuid,
} from 'src/app/store/data-processing/selectors';
import { selectShowItContractModule, selectShowItSystemModule } from 'src/app/store/organization/selectors';
import {
  selectDprEnableItContracts,
  selectDprEnableItSystems,
  selectDprEnableNotifications,
  selectDprEnableOversight,
  selectDprEnableReferences,
  selectDprEnableRoles,
} from 'src/app/store/organization/ui-module-customization/selectors';

@Component({
  selector: 'app-data-processing-details',
  templateUrl: './data-processing-details.component.html',
  styleUrl: './data-processing-details.component.scss',
})
export class DataProcessingDetailsComponent extends BaseComponent implements OnInit, OnDestroy {
  public readonly AppPath = AppPath;

  public readonly isLoading$ = this.store.select(selectDataProcessingLoading);
  public readonly dprName$ = this.store.select(selectDataProcessingName).pipe(filterNullish());
  public readonly dprUuid$ = this.store.select(selectDataProcessingUuid).pipe(filterNullish());

  public readonly hasDeletePermission$ = this.store.select(selectDataProcessingHasDeletePermissions);

  public readonly itSystemsEnabled$ = this.store.select(selectDprEnableItSystems);
  public readonly itContractsEnabled$ = this.store.select(selectDprEnableItContracts);
  public readonly oversightEnabled$ = this.store.select(selectDprEnableOversight);
  public readonly dprRolesEnabled$ = this.store.select(selectDprEnableRoles);
  public readonly dprNotificationsEnabled$ = this.store.select(selectDprEnableNotifications);
  public readonly dprReferencesEnabled$ = this.store.select(selectDprEnableReferences);

  public readonly itSystemsModuleEnabled$ = this.store.select(selectShowItSystemModule);
  public readonly itContractsModuleEnabled$ = this.store.select(selectShowItContractModule);

  public readonly breadCrumbs$ = combineLatest([this.dprName$, this.dprUuid$]).pipe(
    map(([dprName, dprUuid]): BreadCrumb[] => [
      {
        text: $localize`Databehandling`,
        routerLink: `${AppPath.dataProcessing}`,
      },
      {
        text: dprName,
        routerLink: `${dprUuid}`,
      },
    ]),
    filterNullish()
  );

  public readonly navigationItems: NavigationDrawerItem[] = [
    {
      label: $localize`Forside`,
      iconType: 'document',
      route: AppPath.frontpage,
    },
    {
      label: $localize`IT Systemer`,
      iconType: 'systems',
      route: AppPath.itSystems,
      enabled$: combineBooleansWithAnd([this.itSystemsModuleEnabled$, this.itSystemsEnabled$]),
    },
    {
      label: $localize`IT Kontrakter`,
      iconType: 'folder-important',
      route: AppPath.itContracts,
      enabled$: combineBooleansWithAnd([this.itContractsModuleEnabled$, this.itContractsEnabled$]),
    },
    {
      label: $localize`Tilsyn`,
      iconType: 'clipboard',
      route: AppPath.oversight,
      enabled$: this.oversightEnabled$,
    },
    {
      label: $localize`Databehandlingsroller`,
      iconType: 'roles',
      route: AppPath.roles,
      enabled$: this.dprRolesEnabled$,
    },
    {
      label: $localize`Advis`,
      iconType: 'notification',
      route: AppPath.notifications,
      enabled$: this.dprNotificationsEnabled$,
    },
    {
      label: $localize`Referencer`,
      iconType: 'bookmark',
      route: AppPath.externalReferences,
      enabled$: this.dprReferencesEnabled$,
    },
  ];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private actions$: Actions,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToUuidNavigation();
    this.checkResourceExists();
    this.verifyPermissions();

    this.subscriptions.add(
      this.actions$.pipe(ofType(DataProcessingActions.deleteDataProcessingSuccess)).subscribe(() => {
        this.router.navigate([`${AppPath.dataProcessing}`]);
      })
    );
  }

  public showDeleteDialog(): void {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent);
    const confirmationDialogInstance = confirmationDialogRef.componentInstance as ConfirmationDialogComponent;
    confirmationDialogInstance.bodyText = $localize`Er du sikker på du vil slette registeringen?`;
    confirmationDialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      confirmationDialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result === true) {
            this.store.dispatch(DataProcessingActions.deleteDataProcessing());
          }
        })
    );
  }

  private subscribeToUuidNavigation(): void {
    this.subscriptions.add(
      this.route.params
        .pipe(
          map((params) => params['uuid']),
          distinctUntilChanged()
        )
        .subscribe((dprUuid) => {
          this.store.dispatch(DataProcessingActions.getDataProcessingPermissions(dprUuid));
          this.store.dispatch(DataProcessingActions.getDataProcessing(dprUuid));
        })
    );
  }

  private verifyPermissions() {
    // Navigate to Data processing registration if user does not have read permission to the resource
    this.subscriptions.add(
      this.store
        .select(selectDataProcessingHasReadPermissions)
        .pipe(filter((hasReadPermission) => hasReadPermission === false))
        .subscribe(() => {
          this.notificationService.showError($localize`Du har ikke læseadgang til denne Databehandling`);
          this.router.navigate([`${AppPath.dataProcessing}`]);
        })
    );
  }

  private checkResourceExists() {
    this.subscriptions.add(
      this.actions$.pipe(ofType(DataProcessingActions.getDataProcessingError)).subscribe(() => {
        this.notificationService.showError($localize`Databehandling findes ikke`);
        this.router.navigate([`${AppPath.dataProcessing}`]);
      })
    );
  }
}
