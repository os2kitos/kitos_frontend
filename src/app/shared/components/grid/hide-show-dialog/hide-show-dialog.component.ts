import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { UIConfigGridApplication } from 'src/app/shared/models/ui-config/ui-config-grid-application';
import { GridUIConfigService } from 'src/app/shared/services/ui-config-services/grid-ui-config.service';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { ButtonComponent } from '../../buttons/button/button.component';
import { CheckboxComponent } from '../../checkbox/checkbox.component';
import { DialogActionsComponent } from '../../dialogs/dialog-actions/dialog-actions.component';
import { DialogComponent } from '../../dialogs/dialog/dialog.component';
import { ParagraphComponent } from '../../paragraph/paragraph.component';
import { StandardVerticalContentGridComponent } from '../../standard-vertical-content-grid/standard-vertical-content-grid.component';

@Component({
  selector: 'app-hide-show-dialog',
  templateUrl: './hide-show-dialog.component.html',
  styleUrl: './hide-show-dialog.component.scss',
  imports: [
    DialogComponent,
    StandardVerticalContentGridComponent,
    CdkScrollable,
    MatDialogContent,
    NgFor,
    ParagraphComponent,
    NgIf,
    CheckboxComponent,
    DialogActionsComponent,
    ButtonComponent,
  ],
})
export class HideShowDialogComponent implements OnInit {
  @Input() columns!: GridColumn[];
  @Input() uiConfigApplications?: UIConfigGridApplication[] | null = null;
  @Input() entityType!: RegistrationEntityTypes;

  public columnsCopy: GridColumn[] = [];
  public uniqueSections: string[] = [];

  constructor(
    private store: Store,
    private dialogRef: MatDialogRef<HideShowDialogComponent>,
    private gridUIConfigService: GridUIConfigService
  ) {}

  ngOnInit() {
    this.columnsCopy = this.columns
      .filter((column) => column.style !== 'excel-only' && column.style !== 'action-buttons')
      .filter((column) => this.isColumnEnabled(column, this.uiConfigApplications))
      .map((column) => ({ ...column }))
      .sort((a, b) => (a.order_id ?? 0) - (b.order_id ?? 0));
    this.uniqueSections = Array.from(new Set(this.columnsCopy.map((column) => column.section!)));
  }

  public changeVisibility(column: GridColumn) {
    column.hidden = !column.hidden;
  }

  public save() {
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

  public close() {
    this.dialogRef.close();
  }

  public isAllSelectedOfSection(section: string): boolean {
    return this.columnsCopy.filter((column) => column.section === section).every((column) => !column.hidden);
  }
  public toggleSection(value: boolean | undefined, section: string) {
    const columnsInSection = this.columnsCopy.filter((column) => column.section === section && !column.required);
    columnsInSection.forEach((column) => (column.hidden = !value));
  }

  private mergeColumnChanges(): GridColumn[] {
    return this.columns.map((originalColumn) => {
      const updatedColumn = this.columnsCopy.find((c) => c.field === originalColumn.field);
      return updatedColumn ? { ...originalColumn, hidden: updatedColumn.hidden } : originalColumn;
    });
  }

  private isColumnEnabled(column: GridColumn, applications?: UIConfigGridApplication[] | null): boolean {
    if (!applications) return true;

    return this.gridUIConfigService.isColumnEnabled(column, applications);
  }
}
