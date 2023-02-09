import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { AppPath } from 'src/app/shared/enums/app-path';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectGridData, selectGridState, selectIsLoading } from 'src/app/store/it-system-usage/selectors';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';

@Component({
  templateUrl: 'it-systems.component.html',
  styleUrls: ['it-systems.component.scss'],
})
export class ITSystemsComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectIsLoading);
  public readonly gridData$ = this.store.select(selectGridData);
  public readonly gridState$ = this.store.select(selectGridState);

  public readonly organizationName$ = this.store.select(selectOrganizationName);

  public readonly gridColumns: GridColumn[] = [
    { field: 'systemName', title: $localize`IT systemnavn`, filter: 'text' },
    { field: 'systemActive', title: $localize`IT systemets status`, filter: 'boolean' },
  ];

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    // Refresh list on init
    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITSystemUsageActions.updateGridState(gridState));
  }

  public rowIdSelect(rowId: string) {
    this.router.navigate([`${AppPath.itSystems}/${rowId}`]);
  }
}
