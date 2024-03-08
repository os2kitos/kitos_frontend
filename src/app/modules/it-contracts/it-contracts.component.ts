import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import {
  selectContractGridData,
  selectContractGridLoading,
  selectContractGridState,
} from 'src/app/store/it-contract/selectors';

@Component({
  templateUrl: 'it-contracts.component.html',
  styleUrls: ['it-contracts.component.scss'],
})
export class ITContractsComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectContractGridLoading);
  public readonly gridData$ = this.store.select(selectContractGridData);
  public readonly gridState$ = this.store.select(selectContractGridState);

  public readonly gridColumns: GridColumn[] = [
    { field: 'name', title: $localize`IT Kontrakt`, style: 'primary' },
    { field: 'disabled', title: $localize`IT Kontrakt status`, filter: 'boolean', style: 'chip' },
    { field: 'lastChangedById', title: $localize`Sidst ændret ID`, filter: 'numeric' },
    { field: 'lastChangedAt', title: $localize`Sidst ændret`, filter: 'date' },
  ];

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITContractActions.updateGridState(gridState));
  }

  public rowIdSelect(rowId: string) {
    this.router.navigate([rowId], { relativeTo: this.route });
  }
}
