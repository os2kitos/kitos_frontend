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
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import {
  selectInterfaceDeletionConflicts,
  selectInterfaceHasDeletePermission,
  selectInterfaceHasReadPermission,
  selectInterfaceName,
  selectInterfaceUuid,
  selectIsInterfaceLoading,
} from 'src/app/store/it-system-interfaces/selectors';

@Component({
  selector: 'app-it-system-interfaces-details',
  templateUrl: './it-system-interfaces-details.component.html',
  styleUrl: './it-system-interfaces-details.component.scss',
})
export class ItSystemInterfacesDetailsComponent extends BaseComponent implements OnInit, OnDestroy {
  private readonly interfacesRootPath = `${AppPath.itSystems}/${AppPath.itInterfaces}`;
  public readonly AppPath = AppPath;

  public readonly interfaceName$ = this.store.select(selectInterfaceName).pipe(filterNullish());
  public readonly interfaceUuid$ = this.store.select(selectInterfaceUuid).pipe(filterNullish());
  public readonly hasDeletePermissions$ = this.store.select(selectInterfaceHasDeletePermission);
  public readonly deletionConflicts$ = this.store.select(selectInterfaceDeletionConflicts);
  public readonly isLoading$ = this.store.select(selectIsInterfaceLoading);

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly actions$: Actions
  ) {
    super();
  }

  public readonly breadCrumbs$ = combineLatest([this.interfaceName$, this.interfaceUuid$]).pipe(
    map(([interfaceName, interfaceUuid]): BreadCrumb[] => [
      {
        text: $localize`Snitfladekatalog`,
        routerLink: `${AppPath.itSystems}/${AppPath.itInterfaces}`,
      },
      {
        text: interfaceName,
        routerLink: `${interfaceUuid}`,
      },
    ]),
    filterNullish()
  );

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params
        .pipe(
          map((params) => params['uuid']),
          distinctUntilChanged() //Ensures we get changes if navigation occurs between interfaces
        )
        .subscribe((itInterfaceUuid) => {
          this.store.dispatch(ITInterfaceActions.getITInterfacePermissions(itInterfaceUuid));
          this.store.dispatch(ITInterfaceActions.getITInterface(itInterfaceUuid));
        })
    );

    this.subscriptions.add(
      this.store
        .select(selectInterfaceHasReadPermission)
        .pipe(filter((hasReadPermission) => hasReadPermission === false))
        .subscribe(() => {
          this.notificationService.showError($localize`Du har ikke læseadgang til dette Snitflade`);
          this.router.navigate([this.interfacesRootPath]);
        })
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(ITInterfaceActions.getITInterfaceError)).subscribe(() => {
        this.notificationService.showError($localize`Snitflade findes ikke`);
        this.router.navigate([this.interfacesRootPath]);
      })
    );
  }
}
