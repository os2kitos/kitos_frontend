import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { combineLatest, first, map, Subscription } from 'rxjs';
import { AppPath } from 'src/app/shared/enums/app-path';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectITSystemUsageName } from 'src/app/store/it-system-usage/selectors';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';

@Component({
  templateUrl: 'it-system-usage-details.component.html',
  styleUrls: ['it-system-usage-details.component.scss'],
})
export class ITSystemUsageDetailsComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  public readonly AppPath = AppPath;

  public readonly organizationName$ = this.store.select(selectOrganizationName);
  public readonly itSystemUsageName$ = this.store.select(selectITSystemUsageName);

  public readonly breadCrumbs$ = combineLatest([this.organizationName$, this.itSystemUsageName$]).pipe(
    map(([organizationName, itSystemUsageName]): BreadCrumbItem[] => [
      {
        text: $localize`IT systemer i ${organizationName}`,
        title: `${AppPath.itSystems}/${AppPath.itSystemUsages}`,
      },
      {
        text: itSystemUsageName,
      },
    ])
  );

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit() {
    this.subscriptions.add(
      this.route.params
        .pipe(
          map((params) => params['id']),
          first()
        )
        .subscribe((itSystemId) => this.store.dispatch(ITSystemUsageActions.getItSystemUsage(itSystemId)))
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
