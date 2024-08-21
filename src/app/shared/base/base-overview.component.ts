import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { GridExportActions } from 'src/app/store/grid/actions';
import { DEFAULT_UNCLICKABLE_GRID_COLUMN_STYLES } from '../constants';
import { GridColumn } from '../models/grid-column.model';
import { BaseComponent } from './base.component';

@Component({
  template: '',
})
export class BaseOverviewComponent extends BaseComponent {
  protected unclickableColumnsTitles: string[] = [];

  constructor(protected store: Store) {
    super();
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
    const columnTitle = event.column?.title;
    const rowId = event.dataItem?.id;
    if (!this.unclickableColumnsTitles.includes(columnTitle)) {
      router.navigate([rowId], { relativeTo: route });
    }
  }

  protected onExcelExport(exportAllColumns: boolean) {
    this.store.dispatch(GridExportActions.exportDataFetch(exportAllColumns, { all: true }));
  }
}
