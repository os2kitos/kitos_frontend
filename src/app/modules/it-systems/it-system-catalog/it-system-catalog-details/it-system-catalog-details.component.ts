import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, filter, first, map } from 'rxjs';
import { APIItSystemPermissionsResponseDTO } from 'src/app/api/v2/model/itSystemPermissionsResponseDTO';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { IconConfirmationDialogComponent } from 'src/app/shared/components/dialogs/icon-confirmation-dialog/icon-confirmation-dialog.component';
import { InfoDialogComponent } from 'src/app/shared/components/dialogs/info-dialog/info-dialog.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { BreadCrumb } from 'src/app/shared/models/breadcrumbs/breadcrumb.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
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

@Component({
  templateUrl: './it-system-catalog-details.component.html',
  styleUrl: './it-system-catalog-details.component.scss',
})
export class ItSystemCatalogDetailsComponent extends BaseComponent implements OnInit, OnDestroy {
  public readonly AppPath = AppPath;

  public readonly isLoading$ = this.store.select(selectItSystemLoading);
  public readonly itSystemName$ = this.store.select(selectItSystemName).pipe(filterNullish());
  public readonly itSystemUuid$ = this.store.select(selectItSystemUuid).pipe(filterNullish());

  public readonly isSystemAvailable$ = this.store.select(selectItSystemIsActive);
  public readonly isSystemInUseInOrganization$ = this.store.select(selectItSystemIsInUseInOrganization);
  public readonly systemDeletionConflicts$ = this.store.select(selectItSystemDeletetionConflicts);
  public readonly hasEditPermission$ = this.store.select(selectITSystemHasModifyPermission);
  public readonly hasDeletePermission$ = this.store.select(selectITSystemHasDeletePermission);

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
    this.verifyPermissions();
    this.checkResourceExists();
    this.subscribeToStateChangeEvents();
  }

  public showRemoveDialog(deletionConflicts: APIItSystemPermissionsResponseDTO.DeletionConflictsEnum[]): void {
    if (deletionConflicts.length > 0) {
      this.showCannotRemoveInfoDialog(deletionConflicts);
      return;
    }

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

  public showChangeInUseStateDialog(shouldBeInUse: boolean): void {
    const confirmationDialogRef = this.dialog.open(IconConfirmationDialogComponent);
    const confirmationDialogInstance = confirmationDialogRef.componentInstance as IconConfirmationDialogComponent;
    if (shouldBeInUse) {
      confirmationDialogInstance.title = $localize`Tag system i anvendelse`;
      confirmationDialogInstance.bodyText = $localize`Hvis du ønsker at tage systemet i anvendelse, skal du bekræfte og udfylde information, som er relevant for din kommune nu eller senere under IT systemer.`;
      confirmationDialogInstance.icon = 'take-into-use';
      confirmationDialogInstance.confirmColor = 'primary';
      confirmationDialogInstance.customConfirmText = $localize`Bekræft`;
      confirmationDialogInstance.customDeclineText = $localize`Fortryd`;
    } else {
      confirmationDialogInstance.title = $localize`Er du sikker på, at du vil fjerne anvendelse af systemet?`;
      confirmationDialogInstance.bodyText = $localize`Du sletter alle lokale detaljer vedrørerende systemet, men det sletter ikke systemet`;
      confirmationDialogInstance.icon = 'not-in-use';
      confirmationDialogInstance.confirmColor = 'warn';
      confirmationDialogInstance.customConfirmText = $localize`Bekræft og udfyld nu`;
      confirmationDialogInstance.customDeclineText = $localize`Bekræft og udfyld senere`;
    }
    confirmationDialogInstance.confirmationType = 'Custom';

    this.subscriptions.add(
      confirmationDialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result === true) {
            if (shouldBeInUse) {
              this.store.dispatch(ITSystemUsageActions.createItSystemUsage());
              return;
            }
            this.store.dispatch(ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganization());
          }
        })
    );
  }

  private showRemoveConfirmationDialog(): void {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent);
    const confirmationDialogInstance = confirmationDialogRef.componentInstance as ConfirmationDialogComponent;
    confirmationDialogInstance.bodyText = $localize`Er du sikker på du vil slette systemet?`;
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

  private showCannotRemoveInfoDialog(
    deletionConflicts: APIItSystemPermissionsResponseDTO.DeletionConflictsEnum[]
  ): void {
    const confirmationDialogRef = this.dialog.open(InfoDialogComponent);
    const confirmationDialogInstance = confirmationDialogRef.componentInstance as InfoDialogComponent;
    confirmationDialogInstance.title = $localize`Kan ikke slettes`;
    confirmationDialogInstance.bodyText = $localize`Kan ikke slettes på grund af følgende konflikter: `;
    confirmationDialogInstance.listTexts = [];
    if (deletionConflicts.includes(APIItSystemPermissionsResponseDTO.DeletionConflictsEnum.HasChildSystems)) {
      confirmationDialogInstance.listTexts.push($localize`Har underordnede systemer`);
    }
    if (deletionConflicts.includes(APIItSystemPermissionsResponseDTO.DeletionConflictsEnum.HasInterfaceExposures)) {
      confirmationDialogInstance.listTexts.push($localize`Har udstillede snitflader`);
    }
    if (deletionConflicts.includes(APIItSystemPermissionsResponseDTO.DeletionConflictsEnum.HasItSystemUsages)) {
      confirmationDialogInstance.listTexts.push($localize`Har IT-systemanvendelser`);
    }
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
        })
    );
  }
}
