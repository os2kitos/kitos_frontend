import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';

@Component({
  selector: 'app-hide-show-dialog',
  templateUrl: './hide-show-dialog.component.html',
  styleUrl: './hide-show-dialog.component.scss',
})
export class HideShowDialogComponent implements OnInit {
  @Input() columns!: GridColumn[];

  public columnsCopy: GridColumn[] = [];

  constructor(
    private store: Store,
    private actions$: Actions,
    private dialogRef: MatDialogRef<HideShowDialogComponent>
  ) {}

  ngOnInit() {
    this.columnsCopy = this.columns.map((column) => ({ ...column }));
  }

  changeVisibility(column: GridColumn) {
    column.hidden = !column.hidden;
  }

  save() {
    this.store.dispatch(ITInterfaceActions.updateGridColumns(this.columnsCopy));
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
