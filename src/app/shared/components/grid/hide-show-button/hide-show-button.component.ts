import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { HideShowDialogComponent } from '../hide-show-dialog/hide-show-dialog.component';

@Component({
  selector: 'app-hide-show-button',
  templateUrl: './hide-show-button.component.html',
  styleUrl: './hide-show-button.component.scss',
})
export class HideShowButtonComponent {
  @Input() columns$!: Observable<GridColumn[]>;

  constructor(private dialog: MatDialog) {}

  openHideShowDialog() {
    const dialogRef = this.dialog.open(HideShowDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.columns$ = this.columns$;
  }
}
