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
import { combineAND } from 'src/app/shared/helpers/observable-helpers';
import { BreadCrumb } from 'src/app/shared/models/breadcrumbs/breadcrumb.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
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
  selectItContractEnableAdvis,
  selectItContractEnableContractRoles,
  selectItContractEnableDataProcessing,
  selectItContractEnableDeadlines,
  selectItContractEnableEconomy,
  selectItContractEnableHierarchy,
  selectItContractEnableItSystems,
  selectItContractEnableReferences,
} from 'src/app/store/organization/ui-module-customization/selectors';

@Component({
  selector: 'app-it-contract-details',
  templateUrl: './it-contract-details.component.html',
  styleUrl: './it-contract-details.component.scss',
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
    filterNullish()
  );
  public readonly itSystemsTabEnabled$ = this.store.select(selectItContractEnableItSystems);
  public readonly dataProcessingTabEnabled$ = this.store.select(selectItContractEnableDataProcessing);
  public readonly agreementDeadlinesTabEnabled$ = this.store.select(selectItContractEnableDeadlines);
  public readonly economyTabEnabled$ = this.store.select(selectItContractEnableEconomy);
  public readonly contractRolesTabEnabled$ = this.store.select(selectItContractEnableContractRoles);
  public readonly hierarchyTabEnabled$ = this.store.select(selectItContractEnableHierarchy);
  public readonly notificationsTabEnabled$ = this.store.select(selectItContractEnableAdvis);
  public readonly referenceTabEnabled$ = this.store.select(selectItContractEnableReferences);

  public readonly dataProcessingModuleEnabled$ = this.store.select(selectShowDataProcessingRegistrations);
  public readonly itSystemsModuleEnabled$ = this.store.select(selectShowItSystemModule);

  public readonly navigationItems: NavigationDrawerItem[] = [
    {
      label: $localize`Kontraktforside`,
      iconType: 'document',
      route: AppPath.frontpage,
    },
    {
      label: $localize`IT Systemer`,
      iconType: 'systems',
      route: AppPath.itSystems,
      enabled$: combineAND([this.itSystemsModuleEnabled$, this.itSystemsTabEnabled$]),
    },
    {
      label: $localize`Databehandling`,
      iconType: 'folder-important',
      route: AppPath.dataProcessing,
      enabled$: combineAND([this.dataProcessingModuleEnabled$, this.dataProcessingTabEnabled$]),
    },
    {
      label: $localize`Aftalefrister`,
      iconType: 'clipboard',
      route: AppPath.agreementDeadlines,
      enabled$: this.agreementDeadlinesTabEnabled$,
    },
    {
      label: $localize`Økonomi`,
      iconType: 'money',
      route: AppPath.economy,
      enabled$: this.economyTabEnabled$,
    },
    {
      label: $localize`Kontraktroller`,
      iconType: 'roles',
      route: AppPath.roles,
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
      enabled$: this.notificationsTabEnabled$,
    },
    {
      label: $localize`Referencer`,
      iconType: 'bookmark',
      route: AppPath.externalReferences,
      enabled$: this.referenceTabEnabled$,
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
      this.actions$.pipe(ofType(ITContractActions.deleteITContractSuccess)).subscribe(() => {
        this.router.navigate([`${AppPath.itContracts}`]);
      })
    );
  }

  public showDeleteDialog(): void {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent);
    const confirmationDialogInstance = confirmationDialogRef.componentInstance as ConfirmationDialogComponent;
    confirmationDialogInstance.bodyText = $localize`Er du sikker på, at du vil slette kontrakten?`;
    confirmationDialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      confirmationDialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result === true) {
            this.store.dispatch(ITContractActions.deleteITContract());
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
        .subscribe((itContractUuid) => {
          this.store.dispatch(ITContractActions.getITContractPermissions(itContractUuid));
          this.store.dispatch(ITContractActions.getITContract(itContractUuid));
        })
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
        })
    );
  }

  private checkResourceExists() {
    this.subscriptions.add(
      this.actions$.pipe(ofType(ITContractActions.getITContractError)).subscribe(() => {
        this.notificationService.showError($localize`IT Kontrakt findes ikke`);
        this.router.navigate([`${AppPath.itContracts}`]);
      })
    );
  }
}
