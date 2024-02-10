import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, filter, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { BreadCrumb } from 'src/app/shared/models/breadcrumbs/breadcrumb.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import {
  selectITSystemHasReadPermission,
  selectItSystemLoading,
  selectItSystemName,
  selectItSystemUuid,
} from 'src/app/store/it-system/selectors';

@Component({
  selector: 'app-it-system-catalog-details',
  templateUrl: './it-system-catalog-details.component.html',
  styleUrl: './it-system-catalog-details.component.scss',
})
export class ItSystemCatalogDetailsComponent extends BaseComponent implements OnInit, OnDestroy {
  public readonly AppPath = AppPath;

  public readonly isLoading$ = this.store.select(selectItSystemLoading);
  public readonly itSystemName$ = this.store.select(selectItSystemName).pipe(filterNullish());
  public readonly itSystemUuid$ = this.store.select(selectItSystemUuid).pipe(filterNullish());

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
    private actions$: Actions
  ) {
    super();
  }
  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params
        .pipe(
          map((params) => params['uuid']),
          distinctUntilChanged() //Ensures we get changes if navigation occurs between systems
        )
        .subscribe((itSystemUsageUuid) => {
          this.store.dispatch(ITSystemActions.getITSystemPermissions(itSystemUsageUuid));
          this.store.dispatch(ITSystemActions.getITSystem(itSystemUsageUuid));
        })
    );

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

    // Navigate to IT System Catalog if ressource does not exist
    this.subscriptions.add(
      this.actions$.pipe(ofType(ITSystemActions.getITSystemError)).subscribe(() => {
        this.notificationService.showError($localize`IT System findes ikke`);
        this.router.navigate([`${AppPath.itSystems}/${AppPath.itSystemCatalog}`]);
      })
    );
  }
}
