import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import {
  selectDataProcessingGridData,
  selectDataProcessingGridLoading,
  selectDataProcessingGridState,
} from 'src/app/store/data-processing/selectors';

@Component({
  selector: 'app-data-processing-overview',
  templateUrl: './data-processing-overview.component.html',
  styleUrl: './data-processing-overview.component.scss',
})
export class DataProcessingOverviewComponent extends BaseComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectDataProcessingGridLoading);
  public readonly gridData$ = this.store.select(selectDataProcessingGridData);
  public readonly gridState$ = this.store.select(selectDataProcessingGridState);

  public readonly gridColumns: GridColumn[] = [
    { field: 'name', title: $localize`Databehandling`, style: 'primary' },
    { field: 'disabled', title: $localize`Databehandling status`, filter: 'boolean', style: 'chip' },
    { field: 'lastChangedById', title: $localize`Sidst ændret ID`, filter: 'numeric' },
    { field: 'lastChangedAt', title: $localize`Sidst ændret`, filter: 'date' },
  ];

  constructor(private store: Store, private router: Router, private route: ActivatedRoute, private actions$: Actions) {
    super();
  }

  ngOnInit(): void {
    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(DataProcessingActions.createDataProcessingSuccess), combineLatestWith(this.gridState$))
        .subscribe(([_, gridState]) => {
          this.stateChange(gridState);
        })
    );
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(DataProcessingActions.updateGridState(gridState));
  }

  public rowIdSelect(rowId: string) {
    this.router.navigate([rowId], { relativeTo: this.route });
  }
}
