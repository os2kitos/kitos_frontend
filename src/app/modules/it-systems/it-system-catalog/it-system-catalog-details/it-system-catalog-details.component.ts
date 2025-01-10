import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, filter, first, map } from 'rxjs';
import { APIItSystemPermissionsResponseDTO } from 'src/app/api/v2/model/itSystemPermissionsResponseDTO';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { NavigationDrawerItem } from 'src/app/shared/components/navigation-drawer/navigation-drawer.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { BreadCrumb } from 'src/app/shared/models/breadcrumbs/breadcrumb.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { DialogOpenerService } from 'src/app/shared/services/dialog-opener.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectITSystemUsageHasCreateCollectionPermission } from 'src/app/store/it-system-usage/selectors';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import {
  selectITSystemHasDeletePermission,
  selectITSystemHasModifyPermission,
  selectITSystemHasReadPermission,
  selectItSystemDeletetionConflicts,
  selectItSystemIsActive,
  selectItSystemIsInUseInOrganization,
  selectItSystemLoading,
  selectItSystemName,
  selectItSystemUuid,
} from 'src/app/store/it-system/selectors';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';
import { ITSystemCatalogDetailsComponentStore } from './it-system-catalog-details.component-store';

@Component({
  templateUrl: './it-system-catalog-details.component.html',
  styleUrl: './it-system-catalog-details.component.scss',
  providers: [ITSystemCatalogDetailsComponentStore],
})
export class ItSystemCatalogDetailsComponent extends BaseComponent implements OnInit, OnDestroy {
  public readonly AppPath = AppPath;

  public readonly isLoading$ = this.store.select(selectItSystemLoading);
  public readonly itSystemName$ = this.store.select(selectItSystemName).pipe(filterNullish());
  public readonly itSystemUuid$ = this.store.select(selectItSystemUuid).pipe(filterNullish());
  public readonly organizationName$ = this.store.select(selectOrganizationName).pipe(filterNullish());

  public readonly isSystemAvailable$ = this.store.select(selectItSystemIsActive);
  public readonly isSystemInUseInOrganization$ = this.store.select(selectItSystemIsInUseInOrganization);
  public readonly systemDeletionConflicts$ = this.store.select(selectItSystemDeletetionConflicts);
  public readonly hasEditPermission$ = this.store.select(selectITSystemHasModifyPermission);
  public readonly hasDeletePermission$ = this.store.select(selectITSystemHasDeletePermission);
  public readonly hasUsageCreatePermission$ = this.store.select(selectITSystemUsageHasCreateCollectionPermission);

  public readonly hasUsageDeletePermission$ = this.componentStore.usageModifyPermission$;

  public readonly breadCrumbs$ = combineLatest([this.itSystemName$, this.itSystemUuid$]).pipe(
    map(([itSystemName, systemUuid]): BreadCrumb[] => [
      {
        text: $localize`IT Systemkatalog`,
        routerLink: `${AppPath.itSystems}/${AppPath.itSystemCatalog}`,
      },
      {
        text: itSystemName,
        routerLink: `${systemUuid}`,
      },
    ]),
    filterNullish()
  );

  public readonly navigationItems: NavigationDrawerItem[] = [
    {
      label: $localize`Systemforside`,
      iconType: 'document',
      route: AppPath.frontpage,
    },
    {
      label: $localize`Udstillede snitflader`,
      iconType: 'systems',
      route: AppPath.itInterfaces,
    },
    {
      label: $localize`KLE`,
      iconType: 'table',
      route: AppPath.kle,
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
    private dialog: MatDialog,
    private dialogOpenerService: DialogOpenerService,
    private componentStore: ITSystemCatalogDetailsComponentStore
  ) {
    super();
  }
  ngOnInit(): void {
    this.subscribeToUuidNavigation();
    this.verifyPermissions();
    this.checkResourceExists();
    this.subscribeToStateChangeEvents();

    this.componentStore.getUsageDeletePermissionsForItSystem();
  }

  public showRemoveDialog(): void {
    this.showRemoveConfirmationDialog();
  }

  public showDisableEnableDialog(shouldBeDisabled: boolean): void {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent);
    const confirmationDialogInstance = confirmationDialogRef.componentInstance as ConfirmationDialogComponent;
    confirmationDialogInstance.bodyText = $localize`Er du sikker på, at du vil gøre IT Systemet ${
      shouldBeDisabled ? "'ikke tilgængeligt'" : "'tilgængeligt'"
    }?`;
    confirmationDialogInstance.confirmColor = shouldBeDisabled ? 'warn' : 'primary';

    this.subscriptions.add(
      confirmationDialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result === true) {
            this.store.dispatch(ITSystemActions.patchITSystem({ deactivated: shouldBeDisabled }));
          }
        })
    );
  }

  public showChangeInUseStateDialog(takingIntoUse: boolean): void {
    this.subscriptions.add(
      this.organizationName$.pipe(first())
        .subscribe((organizationName) => {
          let confirmationDialogRef;
          if (takingIntoUse) {
            confirmationDialogRef = this.dialogOpenerService.openTakeSystemIntoUseDialog();
          } else {
            confirmationDialogRef = this.dialogOpenerService.openTakeSystemOutOfUseDialog(organizationName);
          }

        this.subscriptions.add(
          confirmationDialogRef
            .afterClosed()
            .pipe(concatLatestFrom(() => this.itSystemUuid$))
            .subscribe(([result, systemUuid]) => {
              if (result === undefined) return;

                if (takingIntoUse) {
                  this.tryTakeIntoUse(result, systemUuid);
                  return;
                }
                this.tryTakeOutOfUse(result, systemUuid);
              })
          );
        })
    );
  }

  private tryTakeIntoUse(dialogResult: boolean, systemUuid: string) {
    if (dialogResult === true) {
      this.navigateToUsageOnUsageCreatedSuccess();
    }
    this.store.dispatch(ITSystemUsageActions.createItSystemUsage(systemUuid));
  }

  private tryTakeOutOfUse(dialogResult: boolean, systemUuid: string) {
    if (dialogResult === true) {
      this.store.dispatch(ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganization(systemUuid));
    }
  }

  private showRemoveConfirmationDialog(): void {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent);
    const confirmationDialogInstance = confirmationDialogRef.componentInstance as ConfirmationDialogComponent;
    confirmationDialogInstance.bodyText = $localize`Er du sikker på, at du vil slette systemet?`;
    confirmationDialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      confirmationDialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result === true) {
            this.store.dispatch(ITSystemActions.deleteITSystem());
          }
        })
    );
  }

  public readonly conflictsText$ = this.systemDeletionConflicts$.pipe(
    map((conflicts) => {
      if (!conflicts || conflicts.length === 0) return '';

      let text = '';
      if (conflicts.includes(APIItSystemPermissionsResponseDTO.DeletionConflictsEnum.HasChildSystems)) {
        text += $localize`Systemet er registreret som "Overordnet System" for én eller flere IT Systemer. `;
      }
      if (conflicts.includes(APIItSystemPermissionsResponseDTO.DeletionConflictsEnum.HasInterfaceExposures)) {
        text += $localize`Systemet er registreret som "Udstillet af" på én eller flere snitfladebeskrivelser i Snitfladekataloget. `;
      }
      if (conflicts.includes(APIItSystemPermissionsResponseDTO.DeletionConflictsEnum.HasItSystemUsages)) {
        text += $localize`Systemet er i anvendelse i én eller flere kommuner.`;
      }

      return text;
    })
  );

  private subscribeToUuidNavigation(): void {
    this.subscriptions.add(
      this.route.params
        .pipe(
          map((params) => params['uuid']),
          distinctUntilChanged() //Ensures we get changes if navigation occurs between systems
        )
        .subscribe((itSystemUuid) => {
          this.store.dispatch(ITSystemActions.getITSystemPermissions(itSystemUuid));
          this.store.dispatch(ITSystemActions.getITSystem(itSystemUuid));
          this.store.dispatch(ITSystemUsageActions.getITSystemUsageCollectionPermissions());
        })
    );
  }

  private verifyPermissions() {
    // Navigate to IT System Catalog if user does not have read permission to the resource
    this.subscriptions.add(
      this.store
        .select(selectITSystemHasReadPermission)
        .pipe(filter((hasReadPermission) => hasReadPermission === false))
        .subscribe(() => {
          this.notificationService.showError($localize`Du har ikke læseadgang til dette IT System`);
          this.router.navigate([`${AppPath.itSystems}/${AppPath.itSystemCatalog}`]);
        })
    );
  }

  private checkResourceExists() {
    // Navigate to IT System Catalog if ressource does not exist
    this.subscriptions.add(
      this.actions$.pipe(ofType(ITSystemActions.getITSystemError)).subscribe(() => {
        this.notificationService.showError($localize`IT System findes ikke`);
        this.router.navigate([`${AppPath.itSystems}/${AppPath.itSystemCatalog}`]);
      })
    );
  }

  private subscribeToStateChangeEvents() {
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.createItSystemUsageSuccess,
            ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganizationSuccess
          )
        )
        .subscribe(({ itSystemUuid }) => {
          this.store.dispatch(ITSystemActions.getITSystem(itSystemUuid));
          this.store.dispatch(ITSystemActions.getITSystemPermissions(itSystemUuid));
        })
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(ITSystemActions.deleteITSystemSuccess)).subscribe(() => {
        this.router.navigate([`${AppPath.itSystems}/${AppPath.itSystemCatalog}`]);
      })
    );
  }

  private navigateToUsageOnUsageCreatedSuccess() {
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.createItSystemUsageSuccess))
        .subscribe(({ itSystemUuid: _, usageUuid }) => {
          this.router.navigate([`${AppPath.itSystems}/${AppPath.itSystemUsages}/${usageUuid}`]);
        })
    );
  }
}
