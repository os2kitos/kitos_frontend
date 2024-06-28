import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';

@Component({
  selector: 'app-hide-show-dialog',
  templateUrl: './hide-show-dialog.component.html',
  styleUrl: './hide-show-dialog.component.scss',
})
export class HideShowDialogComponent implements OnInit {
  @Input() columns!: GridColumn[];
  @Input() entityType!: RegistrationEntityTypes;

  public columnsCopy: GridColumn[] = [];
  public uniqueSections: string[] = [];

  constructor(private store: Store, private dialogRef: MatDialogRef<HideShowDialogComponent>) {}

  ngOnInit() {
    this.columnsCopy = this.columns.map((column) => ({ ...column }));
    this.uniqueSections = Array.from(new Set(this.columns.map((column) => column.section)));
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
