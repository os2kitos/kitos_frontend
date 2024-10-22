import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, filter, first, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { NavigationDrawerItem } from 'src/app/shared/components/collapsible-navigation-drawer/collapsible-navigation-drawer.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { AppPath } from 'src/app/shared/enums/app-path';
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
    },
    {
      label: $localize`Databehandling`,
      iconType: 'folder-important',
      route: AppPath.dataProcessing,
    },
    {
      label: $localize`Aftalefrister`,
      iconType: 'clipboard',
      route: AppPath.agreementDeadlines,
    },
    {
      label: $localize`Økonomi`,
      iconType: 'money',
      route: AppPath.economy,
    },
    {
      label: $localize`Kontraktroller`,
      iconType: 'roles',
      route: AppPath.roles,
    },
    {
      label: $localize`Hierarki`,
      iconType: 'organization',
      route: AppPath.hierarchy,
    },
    {
      label: $localize`Advis`,
      iconType: 'notification',
      route: AppPath.notifications,
    },
    {
      label: $localize`Referencer`,
      iconType: 'bookmark',
      route: AppPath.externalReferences,
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
    confirmationDialogInstance.bodyText = $localize`Er du sikker på du vil slette kontrakten?`;
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
