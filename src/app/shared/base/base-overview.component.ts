import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { GridExportActions } from 'src/app/store/grid/actions';
import { UserActions } from 'src/app/store/user-store/actions';
import { DEFAULT_UNCLICKABLE_GRID_COLUMN_STYLES } from '../constants';
import { GridColumn } from '../models/grid-column.model';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';
import { BaseComponent } from './base.component';

@Component({
  template: '',
})
export class BaseOverviewComponent extends BaseComponent {
  protected unclickableColumnsTitles: string[] = [];

  constructor(
    protected store: Store,
    @Inject('RegistrationEntityTypes') protected entityType: RegistrationEntityTypes
  ) {
    super();
    this.store.dispatch(UserActions.getUserGridPermissions());
  }

  protected updateUnclickableColumns(
    currentColumns: GridColumn[],
    unclickableColumnStyles: string[] = DEFAULT_UNCLICKABLE_GRID_COLUMN_STYLES
  ) {
    this.unclickableColumnsTitles = [];
    currentColumns.forEach((column) => {
      if (column.style && unclickableColumnStyles.includes(column.style)) {
        this.unclickableColumnsTitles.push(column.title);
      }
    });
  }

  protected rowIdSelect(event: CellClickEvent, router: Router, route: ActivatedRoute) {
    if (this.cellIsClickableStyleOrEmpty(event)) {
      const rowId = event.dataItem?.id;
      router.navigate([rowId], { relativeTo: route });
    }
  }

  private cellIsClickableStyleOrEmpty(event: CellClickEvent) {
    const column = event.column;
    const columnTitle = column.title;
    const columnFieldName = column.field;
    return !this.unclickableColumnsTitles.includes(columnTitle) || !event.dataItem[columnFieldName];
  }

  protected onExcelExport = (exportAllColumns: boolean) => {
    this.store.dispatch(GridExportActions.exportDataFetch(exportAllColumns, { all: true }, this.entityType));
  };
}
