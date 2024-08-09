import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { CONTRACT_COLUMNS_ID } from 'src/app/shared/persistent-state-constants';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import {
  selectContractGridColumns,
  selectContractGridData,
  selectContractGridLoading,
  selectContractGridState,
  selectItContractHasCollectionCreatePermissions,
} from 'src/app/store/it-contract/selectors';

@Component({
  templateUrl: 'it-contracts.component.html',
  styleUrls: ['it-contracts.component.scss'],
})
export class ITContractsComponent extends BaseComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectContractGridLoading);
  public readonly gridData$ = this.store.select(selectContractGridData);
  public readonly gridState$ = this.store.select(selectContractGridState);
  public readonly gridColumns$ = this.store.select(selectContractGridColumns);

  public readonly hasCreatePermission$ = this.store.select(selectItContractHasCollectionCreatePermissions);

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private actions$: Actions,
    private statePersistingService: StatePersistingService
  ) {
    super();
  }

  private readonly gridColumns: GridColumn[] = [
    { field: 'name', title: $localize`IT Kontrakt`, section: 'IT Kontrakter', style: 'primary', hidden: false },
    {
      field: 'disabled',
      title: $localize`IT Kontrakt status`,
      section: 'IT Kontrakter',
      filter: 'boolean',
      style: 'chip',
      hidden: false,
    },
    {
      field: 'lastChangedById',
      title: $localize`Sidst ændret ID`,
      section: 'IT Kontrakter',
      filter: 'numeric',
      hidden: false,
    },
    { field: 'lastChangedAt', title: $localize`Sidst ændret`, section: 'IT Kontrakter', filter: 'date', hidden: false },
  ];

  ngOnInit(): void {
    const existingColumns = this.statePersistingService.get<GridColumn[]>(CONTRACT_COLUMNS_ID);
    this.store.dispatch(ITContractActions.getItContractOverviewRoles());
    if (existingColumns) {
      this.store.dispatch(ITContractActions.updateGridColumns(existingColumns));
    } else {
      this.subscriptions.add(
        this.actions$
          .pipe(
            ofType(ITContractActions.getItContractOverviewRolesSuccess),
            combineLatestWith(this.store.select(selectContractGridColumns)),
            first()
          )
          .subscribe(([_, gridRoleColumns]) => {
            this.store.dispatch(ITContractActions.updateGridColumnsAndRoleColumns(this.gridColumns, gridRoleColumns));
          })
      );
    }
    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.createItContractSuccess), combineLatestWith(this.gridState$))
        .subscribe(([_, gridState]) => {
          this.stateChange(gridState);
        })
    );
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITContractActions.updateGridState(gridState));
  }

  public rowIdSelect(rowId: string) {
    this.router.navigate([rowId], { relativeTo: this.route });
  }
}
