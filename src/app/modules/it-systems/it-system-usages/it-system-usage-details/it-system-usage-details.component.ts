import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, filter, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { BreadCrumb } from 'src/app/shared/models/breadcrumbs/breadcrumb.model';
import { tabIsEnabled } from 'src/app/shared/models/helpers/ui-config-helpers';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
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
import { selectITSystemUsageUIModuleConfigEnableTabGdpr } from 'src/app/store/organization/ui-module-customization/selectors';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';
import { ITSystemUsageRemoveComponent } from './it-system-usage-remove/it-system-usage-remove.component';
import { UIModuleConfigActions } from 'src/app/store/organization/ui-module-customization/actions';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';

@Component({
  templateUrl: 'it-system-usage-details.component.html',
  styleUrls: ['it-system-usage-details.component.scss'],
})
export class ITSystemUsageDetailsComponent extends BaseComponent implements OnInit, OnDestroy {
  public readonly AppPath = AppPath;

  public readonly isLoading$ = this.store.select(selectIsSystemUsageLoading);
  public readonly organizationName$ = this.store.select(selectOrganizationName).pipe(filterNullish());
  public readonly itSystemUsageName$ = this.store.select(selectItSystemUsageName).pipe(filterNullish());
  public readonly itSystemUsageUuid$ = this.store.select(selectItSystemUsageUuid).pipe(filterNullish());
  public readonly hasDeletePermissions$ = this.store.select(selectITSystemUsageHasDeletePermission);
  public readonly enableGdprTab$ = this.store.select(selectITSystemUsageUIModuleConfigEnableTabGdpr);

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
    filterNullish()
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private actions$: Actions,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(UIModuleConfigActions.getUIModuleConfig({ module: UIModuleConfigKey.ItSystemUsage }));
    this.subscriptions.add(
      this.route.params
        .pipe(
          map((params) => params['uuid']),
          distinctUntilChanged() //Ensures we get changes if navigation occurs between usages
        )
        .subscribe((itSystemUsageUuid) => {
          this.store.dispatch(ITSystemUsageActions.getITSystemUsagePermissions(itSystemUsageUuid));
          this.store.dispatch(ITSystemUsageActions.getITSystemUsage(itSystemUsageUuid));
        })
    );

    // Navigate to IT System Usages if user does not have read persmission to ressource
    this.subscriptions.add(
      this.store
        .select(selectITSystemUsageHasReadPermission)
        .pipe(filter((hasReadPermission) => hasReadPermission === false))
        .subscribe(() => {
          this.notificationService.showError($localize`Du har ikke læseadgang til dette IT System`);
          this.router.navigate([`${AppPath.itSystems}/${AppPath.itSystemUsages}`]);
        })
    );

    // Navigate to IT System Usages if ressource does not exist
    this.subscriptions.add(
      this.actions$.pipe(ofType(ITSystemUsageActions.getITSystemUsageError)).subscribe(() => {
        this.notificationService.showError($localize`IT System findes ikke`);
        this.router.navigate([`${AppPath.itSystems}/${AppPath.itSystemUsages}`]);
      })
    );

    // Load the catalog system as it is used across several different pages
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageSystemContextUuid)
        .pipe(filterNullish(), distinctUntilChanged())
        .subscribe((systemContextUuid) => this.store.dispatch(ITSystemActions.getITSystem(systemContextUuid)))
    );
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.store.dispatch(ITSystemUsageActions.getITSystemUsagePermissionsSuccess());
    this.store.dispatch(ITSystemUsageActions.getITSystemUsageSuccess());
  }

  public showRemoveDialog() {
    this.dialog.open(ITSystemUsageRemoveComponent);
  }
}
