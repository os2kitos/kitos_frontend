import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, first, of } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import {
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

  public readonly hasCreatePermission$ = this.store.select(selectItContractHasCollectionCreatePermissions);

  //mock subscription, remove once working on the Contracts overview task
  public readonly gridColumns = of<GridColumn[]>([
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
  ]);

  constructor(private store: Store, private router: Router, private route: ActivatedRoute, private actions$: Actions) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(ITContractActions.getITContractCollectionPermissions());

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
