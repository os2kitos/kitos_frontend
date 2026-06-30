import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, filter, first, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { BreadcrumbsComponent } from 'src/app/shared/components/breadcrumbs/breadcrumbs.component';
import { ButtonComponent } from 'src/app/shared/components/buttons/button/button.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import {
  NavigationDrawerComponent,
  NavigationDrawerItem,
} from 'src/app/shared/components/navigation-drawer/navigation-drawer.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { BreadCrumb } from 'src/app/shared/models/breadcrumbs/breadcrumb.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageArchiveActions } from 'src/app/store/it-system-usage-archive/actions';
import {
  selectItSystemUsageArchive,
  selectItSystemUsageArchiveLegacyName,
  selectItSystemUsageArchiveLoading,
  selectItSystemUsageArchiveUuid,
  selectUsageArchiveHasDeletePermission,
  selectUsageArchiveHasReadPermission,
} from 'src/app/store/it-system-usage-archive/selectors';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';

@Component({
  selector: 'app-it-system-usage-archive-details',
  imports: [
    AsyncPipe,
    BreadcrumbsComponent,
    LoadingComponent,
    NavigationDrawerComponent,
    RouterOutlet,
    ButtonComponent,
  ],
  templateUrl: './it-system-usage-archive-details.component.html',
  styleUrl: './it-system-usage-archive-details.component.scss',
})
export class ItSystemUsageArchiveDetailsComponent extends BaseComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectItSystemUsageArchiveLoading);
  public readonly usageArchive$ = this.store.select(selectItSystemUsageArchive);
  public readonly usageArchiveLegacyName$ = this.store
    .select(selectItSystemUsageArchiveLegacyName)
    .pipe(filterNullish());
  public readonly usageArchiveUuid$ = this.store.select(selectItSystemUsageArchiveUuid).pipe(filterNullish());

  public readonly organizationName$ = this.store.select(selectOrganizationName);
  public readonly hasDeletePermission$ = this.store.select(selectUsageArchiveHasDeletePermission);

  public readonly breadCrumbs$ = combineLatest([
    this.usageArchiveLegacyName$,
    this.usageArchiveUuid$,
    this.organizationName$,
  ]).pipe(
    map(([usageArchiveLegacyName, usageArchiveUuid, organizationName]): BreadCrumb[] => [
      {
        text: $localize`Anvendelseshistorik for IT Systemer i ${organizationName}`,
        routerLink: `${AppPath.itSystems}/${AppPath.itSystemUsageArchive}`,
      },
      {
        text: usageArchiveLegacyName,
        routerLink: `${usageArchiveUuid}`,
      },
    ]),
    filterNullish(),
  );

  public readonly navigationItems: NavigationDrawerItem[] = [
    {
      label: $localize`Forside`,
      iconType: 'document',
      route: AppPath.frontpage,
    },
  ];

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }
  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params
        .pipe(
          map((params) => params['uuid']),
          distinctUntilChanged(),
        )
        .subscribe((usageArchiveUuid) => {
          this.store.dispatch(ITSystemUsageArchiveActions.getITSystemUsageArchivePermissions(usageArchiveUuid));
          this.store.dispatch(ITSystemUsageArchiveActions.getITSystemUsageArchive(usageArchiveUuid));
        }),
    );

    this.verifyReadPermissions();

    this.navigateToRootIfArchiveNotFound();
    this.navigateToRootOnSuccessfulDelete();
  }

  public showDeleteDialog(): void {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent);
    const confirmationDialogInstance = confirmationDialogRef.componentInstance as ConfirmationDialogComponent;
    confirmationDialogInstance.bodyText = $localize`Er du sikker på, at du vil slette anvendelseshistorikken?`;
    confirmationDialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      confirmationDialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result === true) {
            this.store.dispatch(ITSystemUsageArchiveActions.deleteITSystemUsageArchive());
          }
        }),
    );
  }
  private navigateToRootOnSuccessfulDelete() {
    this.subscriptions.add(
      this.actions$.pipe(ofType(ITSystemUsageArchiveActions.deleteITSystemUsageArchiveSuccess)).subscribe(() => {
        this.router.navigateByUrl(`/${AppPath.itSystems}/${AppPath.itSystemUsageArchive}`);
      }),
    );
  }

  private navigateToRootIfArchiveNotFound() {
    this.subscriptions.add(
      this.actions$.pipe(ofType(ITSystemUsageArchiveActions.getITSystemUsageArchiveError)).subscribe(() => {
        this.notificationService.showError($localize`Anvendelseshistorik findes ikke`);
        this.router.navigateByUrl(`${AppPath.itSystems}/${AppPath.itSystemUsageArchive}`);
      }),
    );
  }

  private verifyReadPermissions() {
    this.subscriptions.add(
      this.store
        .select(selectUsageArchiveHasReadPermission)
        .pipe(filter((hasReadPermission) => hasReadPermission === false))
        .subscribe(() => {
          this.notificationService.showError($localize`Du har ikke læseadgang til denne anvendelseshistorik`);
          this.router.navigateByUrl(`${AppPath.itSystems}/${AppPath.itSystemUsageArchive}`);
        }),
    );
  }
}
