import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '@progress/kendo-angular-dialog';
import { combineLatest, first, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { BreadCrumb } from 'src/app/shared/models/breadcrumbs/breadcrumb.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectITSystemUsageHasDeletePermission,
  selectIsSystemUsageLoading,
  selectItSystemUsageName,
  selectItSystemUsageUuid,
} from 'src/app/store/it-system-usage/selectors';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';
import { ITSystemUsageRemoveComponent } from './it-system-usage-remove/it-system-usage-remove.component';

@Component({
  templateUrl: 'it-system-usage-details.component.html',
  styleUrls: ['it-system-usage-details.component.scss'],
})
export class ITSystemUsageDetailsComponent extends BaseComponent implements OnInit {
  public readonly AppPath = AppPath;

  public readonly isLoading$ = this.store.select(selectIsSystemUsageLoading);
  public readonly organizationName$ = this.store.select(selectOrganizationName).pipe(filterNullish());
  public readonly itSystemUsageName$ = this.store.select(selectItSystemUsageName).pipe(filterNullish());
  public readonly itSystemUsageUuid$ = this.store.select(selectItSystemUsageUuid).pipe(filterNullish());
  public readonly hasDeletePermissions$ = this.store.select(selectITSystemUsageHasDeletePermission);

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

  constructor(private route: ActivatedRoute, private store: Store, private dialogService: DialogService) {
    super();
  }

  ngOnInit() {
    this.subscriptions.add(
      this.route.params
        .pipe(
          map((params) => params['uuid']),
          first()
        )
        .subscribe((itSystemUsageUuid) => {
          this.store.dispatch(ITSystemUsageActions.getItSystemUsagePermissions(itSystemUsageUuid));
          this.store.dispatch(ITSystemUsageActions.getItSystemUsage(itSystemUsageUuid));
        })
    );
  }

  public showRemoveDialog() {
    this.dialogService.open({ content: ITSystemUsageRemoveComponent });
  }
}
