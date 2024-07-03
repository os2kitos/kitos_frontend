import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { first, of } from 'rxjs';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectGridData, selectGridState, selectIsLoading } from 'src/app/store/it-system-usage/selectors';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';

@Component({
  templateUrl: 'it-system-usages.component.html',
  styleUrls: ['it-system-usages.component.scss'],
})
export class ITSystemUsagesComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectIsLoading);
  public readonly gridData$ = this.store.select(selectGridData);
  public readonly gridState$ = this.store.select(selectGridState);

  public readonly organizationName$ = this.store.select(selectOrganizationName);

  //mock subscription, remove once working on the Usage overview task
  public readonly gridColumns = of<GridColumn[]>([
    { field: 'systemName', title: $localize`IT systemnavn`, section: 'IT Systemer', style: 'primary', hidden: false },
    {
      field: 'systemActive',
      title: $localize`IT systemets status`,
      section: 'IT Systemer',
      filter: 'boolean',
      style: 'chip',
      hidden: false,
    },
    {
      field: 'lastChangedById',
      title: $localize`Sidst redigeret ID`,
      section: 'IT Systemer',
      filter: 'numeric',
      hidden: false,
    },
    { field: 'lastChangedAt',
      title: $localize`Sidst redigeret`,
      section: 'IT Systemer',
      filter: 'date',
      hidden: false
    },
    /* Example boolean column, adjust in task KITOSUDV-5131
    {
      field: 'Disabled',
      title: $localize`Status`,
      section: $localize`Snitflade`,
      filter: 'boolean',
      filterData: [
        {
          name: $localize`Active text`,
          value: true,
        },
        {
          name: $localize`Inactive text`,
          value: false,
        },
      ],
      entityType: 'it-interface',
      style: 'reverse-chip',
      hidden: false,
    }, */
  ]);

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Refresh list on init
    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITSystemUsageActions.updateGridState(gridState));
  }

  public rowIdSelect(rowId: string) {
    this.router.navigate([rowId], { relativeTo: this.route });
  }
}
