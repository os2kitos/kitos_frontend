import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, first, of } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import {
  selectITSystemHasCreateCollectionPermission,
  selectSystemGridData,
  selectSystemGridLoading,
  selectSystemGridState,
} from 'src/app/store/it-system/selectors';

@Component({
  templateUrl: './it-system-catalog.component.html',
  styleUrl: './it-system-catalog.component.scss',
})
export class ItSystemCatalogComponent extends BaseComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectSystemGridLoading);
  public readonly gridData$ = this.store.select(selectSystemGridData);
  public readonly gridState$ = this.store.select(selectSystemGridState);

  public readonly hasCreatePermission$ = this.store.select(selectITSystemHasCreateCollectionPermission);

  //mock subscription, remove once working on the Catalog overview task
  public readonly gridColumns = of<GridColumn[]>([
    { field: 'name', title: $localize`IT systemnavn`, section: 'IT Systemer', style: 'primary', hidden: false },
    {
      field: 'disabled',
      title: $localize`IT systemets status`,
      section: 'IT Systemer',
      filter: 'boolean',
      style: 'chip',
      hidden: false,
    },
    {
      field: 'lastChangedById',
      title: $localize`Sidst ændret ID`,
      section: 'IT Systemer',
      filter: 'numeric',
      hidden: false,
    },
    { field: 'lastChangedAt', title: $localize`Sidst ændret`, section: 'IT Systemer', filter: 'date', hidden: false },
  ]);

  constructor(private store: Store, private router: Router, private route: ActivatedRoute, private actions$: Actions) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(ITSystemActions.getITSystemCollectionPermissions());

    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemActions.createItSystemSuccess), combineLatestWith(this.gridState$))
        .subscribe(([_, gridState]) => {
          this.stateChange(gridState);
        })
    );
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITSystemActions.updateGridState(gridState));
  }

  public rowIdSelect(rowId: string) {
    this.router.navigate([rowId], { relativeTo: this.route });
  }
}
