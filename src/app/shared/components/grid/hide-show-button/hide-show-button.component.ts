import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { HideShowDialogComponent } from '../hide-show-dialog/hide-show-dialog.component';

@Component({
  selector: 'app-hide-show-button[columns][entityType]',
  templateUrl: './hide-show-button.component.html',
  styleUrl: './hide-show-button.component.scss',
})
export class HideShowButtonComponent {
  @Input() columns!: GridColumn[] | null;
  @Input() entityType!: RegistrationEntityTypes;

  constructor(private dialog: MatDialog) {}

  openHideShowDialog() {
    if (this.columns === null) return;

    const dialogRef = this.dialog.open(HideShowDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.columns = this.columns;
    dialogInstance.entityType = this.entityType;
  }
}
