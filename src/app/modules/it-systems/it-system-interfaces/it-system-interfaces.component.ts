import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import {
  selectInterfaceGridColumns,
  selectInterfaceGridData,
  selectInterfaceGridLoading,
  selectInterfaceGridState,
  selectInterfaceHasCreateCollectionPermission,
} from 'src/app/store/it-system-interfaces/selectors';
import { CreateInterfaceDialogComponent } from './create-interface-dialog/create-interface-dialog.component';

@Component({
  selector: 'app-it-system-interfaces',
  templateUrl: './it-system-interfaces.component.html',
  styleUrl: './it-system-interfaces.component.scss',
})
export class ItSystemInterfacesComponent extends BaseComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectInterfaceGridLoading);
  public readonly gridData$ = this.store.select(selectInterfaceGridData);
  public readonly gridState$ = this.store.select(selectInterfaceGridState);
  public readonly gridColumns$ = this.store.select(selectInterfaceGridColumns);

  public readonly hasCreatePermission$ = this.store.select(selectInterfaceHasCreateCollectionPermission);

  private readonly gridColumns: GridColumn[] = [
    { field: 'name', title: $localize`Snitflade`, style: 'primary', hidden: false },
    { field: 'Disabled', title: $localize`Status`, filter: 'boolean', style: 'reverse-chip', width: 90, hidden: true },
    { field: 'LastChangedByUserId', title: $localize`Sidst ændret ID`, filter: 'numeric', hidden: false },
    { field: 'LastChanged', title: $localize`Sidst ændret`, filter: 'date', hidden: false },
  ];

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private actions$: Actions
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(ITInterfaceActions.getITInterfaceCollectionPermissions());

    this.store.dispatch(ITInterfaceActions.updateGridColumns(this.gridColumns));

    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITInterfaceActions.createITInterfaceSuccess), combineLatestWith(this.gridState$))
        .subscribe(([_, gridState]) => {
          this.stateChange(gridState);
        })
    );
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITInterfaceActions.updateGridState(gridState));
  }

  public rowIdSelect(rowId: string) {
    this.router.navigate([rowId], { relativeTo: this.route });
  }

  public openCreateDialog() {
    this.dialog.open(CreateInterfaceDialogComponent);
  }
}
