import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { first, of } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { GridColumnStyle } from 'src/app/shared/enums/grid-column-style';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectGridData, selectGridState, selectIsLoading } from 'src/app/store/it-system-usage/selectors';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';

@Component({
  templateUrl: 'it-system-usages.component.html',
  styleUrls: ['it-system-usages.component.scss'],
})
export class ITSystemUsagesComponent extends BaseOverviewComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectIsLoading);
  public readonly gridData$ = this.store.select(selectGridData);
  public readonly gridState$ = this.store.select(selectGridState);
  public readonly gridColumns$ = of<GridColumn[]>([
    { field: 'systemName', title: $localize`IT systemnavn`, section: 'IT Systemer', style: GridColumnStyle.primary, hidden: false },
    {
      field: 'systemActive',
      title: $localize`IT systemets status`,
      section: 'IT Systemer',
      filter: 'boolean',
      style: GridColumnStyle.chip,
      hidden: false,
    },
    {
      field: 'lastChangedById',
      title: $localize`Sidst redigeret ID`,
      section: 'IT Systemer',
      filter: 'numeric',
      hidden: false,
    },
    {
      field: 'lastChangedAt',
      title: $localize`Sidst redigeret`,
      section: 'IT Systemer',
      filter: 'date',
      style: GridColumnStyle.date,
      hidden: false,
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
      style: GridColumnStyle.reverseChip,
      hidden: false,
    }, */
  ]);

  public readonly organizationName$ = this.store.select(selectOrganizationName);

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    // Refresh list on init
    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITSystemUsageActions.updateGridState(gridState));
  }
  override rowIdSelect(event: CellClickEvent) {
    super.rowIdSelect(event, this.router, this.route);
  }
}
