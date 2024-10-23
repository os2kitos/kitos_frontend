import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';

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
    this.columnsCopy = this.columns
      .filter((column) => column.style !== 'excel-only' && column.style !== 'action-buttons')
      .map((column) => ({ ...column }));
    this.uniqueSections = Array.from(new Set(this.columns.map((column) => column.section!)));
  }

  changeVisibility(column: GridColumn) {
    column.hidden = !column.hidden;
  }

  mergeColumnChanges(): GridColumn[] {
    return this.columns.map((originalColumn) => {
      const updatedColumn = this.columnsCopy.find((c) => c.field === originalColumn.field);
      return updatedColumn ? { ...originalColumn, hidden: updatedColumn.hidden } : originalColumn;
    });
  }

  save() {
    const updatedColumns = this.mergeColumnChanges();

    switch (this.entityType) {
      case 'it-system-usage':
        this.store.dispatch(ITSystemUsageActions.updateGridColumns(updatedColumns));
        break;
      case 'it-system':
        this.store.dispatch(ITSystemActions.updateGridColumns(updatedColumns));
        break;
      case 'it-interface':
        this.store.dispatch(ITInterfaceActions.updateGridColumns(updatedColumns));
        break;
      case 'data-processing-registration':
        this.store.dispatch(DataProcessingActions.updateGridColumns(updatedColumns));
        break;
      case 'it-contract':
        this.store.dispatch(ITContractActions.updateGridColumns(updatedColumns));
        break;
      case 'organization-user':
        this.store.dispatch(OrganizationUserActions.updateGridColumns(updatedColumns));
        break;
      default:
        throw `HideShowDialogComponent: ${this.entityType} not implemented`;
    }
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
