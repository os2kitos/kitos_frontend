import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';

@Component({
  selector: 'app-hide-show-dialog',
  templateUrl: './hide-show-dialog.component.html',
  styleUrl: './hide-show-dialog.component.scss',
})
export class HideShowDialogComponent {
  @Input() columns$!: Observable<GridColumn[]>;

  constructor(private store: Store, private dialogRef: MatDialogRef<HideShowDialogComponent>) {}

  changeVisibility(column: GridColumn) {
    const updatedColumn = { ...column, hidden: !column.hidden };
    this.store.dispatch(ITInterfaceActions.updateGridColumnHidden(updatedColumn));
  }

  close() {
    this.dialogRef.close();
  }
}
