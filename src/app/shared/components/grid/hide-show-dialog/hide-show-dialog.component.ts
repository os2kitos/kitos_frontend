import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GridColumn } from 'src/app/shared/models/grid-column.model';

@Component({
  selector: 'app-hide-show-dialog',
  templateUrl: './hide-show-dialog.component.html',
  styleUrl: './hide-show-dialog.component.scss',
})
export class HideShowDialogComponent {
  @Input() columns!: GridColumn[];

  constructor(private dialogRef: MatDialogRef<HideShowDialogComponent>) {}

  changeVisibility(column: GridColumn) {
    column.hidden = !column.hidden;
  }

  close() {
    this.dialogRef.close();
  }
}
