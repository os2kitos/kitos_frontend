import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-usages',
  templateUrl: './grid-usages-dialog.component.html',
  styleUrls: ['./grid-usages-dialog.component.scss'],
})
export class GridUsagesDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { usages: string[]; title: string }) {}
}
