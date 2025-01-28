import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { first } from 'rxjs';
import { selectDataProcessingGridState } from 'src/app/store/data-processing/selectors';
import { GridActions } from 'src/app/store/grid/actions';
import { selectContractGridState } from 'src/app/store/it-contract/selectors';
import { selectInterfaceGridState } from 'src/app/store/it-system-interfaces/selectors';
import { selectGridState } from 'src/app/store/it-system-usage/selectors';
import { selectSystemGridState } from 'src/app/store/it-system/selectors';
import { selectOrganizationUserGridState } from 'src/app/store/organization/organization-user/selectors';
import { selectOrganizationGridState } from 'src/app/store/organization/selectors';
import { UserActions } from 'src/app/store/user-store/actions';
import { DEFAULT_UNCLICKABLE_GRID_COLUMN_STYLES } from '../constants/constants';
import { GridColumn } from '../models/grid-column.model';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';
import { BaseComponent } from './base.component';

@Component({
  template: '',
})
export class BaseOverviewComponent extends BaseComponent {
  protected unclickableColumnFields: string[] = [];

  constructor(
    protected store: Store,
    @Inject('RegistrationEntityTypes') protected entityType: RegistrationEntityTypes
  ) {
    super();
    this.store.dispatch(UserActions.getUserGridPermissions());
  }

  protected updateUnclickableColumns(currentColumns: GridColumn[]) {
    this.unclickableColumnFields = [];
    currentColumns.forEach((column) => {
      if (column.style && DEFAULT_UNCLICKABLE_GRID_COLUMN_STYLES.includes(column.style)) {
        this.unclickableColumnFields.push(column.field);
      }
    });
  }

  protected rowIdSelect(event: CellClickEvent, router: Router, route: ActivatedRoute) {
    if (this.cellIsClickableStyleOrEmpty(event)) {
      const rowId = event.dataItem?.id;
      router.navigate([rowId], { relativeTo: route });
    }
  }

  protected cellIsClickableStyle(event: CellClickEvent) {
    const column = event.column;
    const columnFieldName = column.field;
    return !this.unclickableColumnFields.includes(columnFieldName);
  }

  protected onExcelExport = (exportAllColumns: boolean) => {
    this.store
      .select(this.getStateSelector())
      .pipe(first())
      .subscribe((gridState) => {
        this.store.dispatch(
          GridActions.exportDataFetch(exportAllColumns, { ...gridState, all: true }, this.entityType)
        );
      });
  };

  private getStateSelector() {
    switch (this.entityType) {
      case 'it-system-usage':
        return selectGridState;
      case 'data-processing-registration':
        return selectDataProcessingGridState;
      case 'it-contract':
        return selectContractGridState;
      case 'it-interface':
        return selectInterfaceGridState;
      case 'it-system':
        return selectSystemGridState;
      case 'organization-user':
        return selectOrganizationUserGridState;
      case 'global-admin-organization':
      case 'local-admin-organization':
        return selectOrganizationGridState;
      default:
        throw new Error('Invalid entity type');
    }
  }

  private cellIsClickableStyleOrEmpty(event: CellClickEvent) {
    return this.cellIsClickableStyle(event) || !this.getFieldData(event);
  }

  private getFieldData(event: CellClickEvent): boolean {
    if (!event.column.field.includes('.')) {
      return event.dataItem[event.column.field];
    }

    const fieldParts = event.column.field.split('.');
    let value = event.dataItem;

    for (const part of fieldParts) {
      if (value[part] === undefined) {
        value = undefined;
        break;
      } else {
        value = value[part];
      }
    }

    return value;
  }
}
