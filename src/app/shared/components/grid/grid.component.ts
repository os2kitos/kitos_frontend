import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ColumnReorderEvent, GridComponent as KendoGridComponent, PageChangeEvent, SelectionEvent } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, process, SortDescriptor } from '@progress/kendo-data-query';
import { get } from 'lodash';
import { map, Observable } from 'rxjs';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { BaseComponent } from '../../base/base.component';
import { GridColumn } from '../../models/grid-column.model';
import { GridData } from '../../models/grid-data.model';
import { GridState } from '../../models/grid-state.model';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-grid',
  templateUrl: 'grid.component.html',
  styleUrls: ['grid.component.scss'],
})
export class GridComponent<T> extends BaseComponent implements OnChanges {
  @ViewChild(KendoGridComponent) grid?: KendoGridComponent;
  @Input() data!: GridData | null;
  @Input() columns$!: Observable<GridColumn[] | null>;
  @Input() loading: boolean | null = false;
  @Input() state?: GridState | null;
  @Input() exportToExcelName?: string | null;
  @Input() exportAll: boolean = false;

  @Output() stateChange = new EventEmitter<GridState>();
  @Output() rowIdSelect = new EventEmitter<string>();

  public displayedColumns?: string[];
  public dataSource = new MatTableDataSource<T>();

  constructor(private store: Store, private dialog: MatDialog) {
    super();

    this.allData = this.allData.bind(this);
  }

  ngOnChanges(changes: SimpleChanges) {
    // Set state take for Kendo grid to correctly calculate page size and page numbers
    if (changes['data'] && this.state?.all === true) {
      this.state = { ...this.state, take: this.data?.total };
    }
    if (changes['exportAll']) {
      this.exportAll = changes['exportAll'].currentValue;
    }
  }

  public onStateChange(state: GridState) {
    this.state = state;
    this.stateChange.emit(state);
  }

  public onFilterChange(filter: CompositeFilterDescriptor) {
    const take = this.state?.all === true ? this.data?.total : this.state?.take;
    this.onStateChange({ ...this.state, skip: 0, take, filter });
  }

  public onSortChange(sort: SortDescriptor[]) {
    this.onStateChange({ ...this.state, sort });
  }

  public onPageChange(event: PageChangeEvent) {
    this.onStateChange({ ...this.state, skip: event.skip, take: event.take });
  }

  public onPageSizeChange(pageSize?: number) {
    const take = pageSize ?? this.data?.total;
    this.onStateChange({ ...this.state, skip: 0, take, all: pageSize ? false : true });
  }

  public onSelectionChange(event: SelectionEvent) {
    const rowId = event.selectedRows?.pop()?.dataItem?.id;
    if (rowId) {
      this.rowIdSelect.emit(rowId);
    }
  }

  public onColumnReorder(event: ColumnReorderEvent, columns: GridColumn[]) {
    const columnsCopy = [...columns];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columnToMove = columnsCopy.find((column) => column.field === (event.column as any).field);

    if (columnToMove) {
      const oldIndex = columnsCopy.indexOf(columnToMove);
      columnsCopy.splice(oldIndex, 1); // Remove the column from its old position
      columnsCopy.splice(event.newIndex, 0, columnToMove); // Insert the column at the new position

      this.store.dispatch(ITInterfaceActions.updateGridColumns(columnsCopy));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchProperty(object: any, property: string) {
    return get(object, property);
  }

  public checkboxChange(value: boolean | undefined, columnUuid?: string) {
    if (!columnUuid) return;
    if (value === true) {
      this.store.dispatch(ITSystemUsageActions.createItSystemUsage(columnUuid));
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent);
      const dialogInstance = dialogRef.componentInstance;
      dialogInstance.bodyText = $localize`Er du sikker på at du vil fjerne den lokale anvendelse af systemet? Dette sletter ikke systemet, men vil slette alle lokale detaljer vedrørende anvendelsen.`;
      dialogInstance.confirmColor = 'warn';

      this.subscriptions.add(
        dialogRef.afterClosed().subscribe((result) => {
          if (result === true) {
            this.store.dispatch(ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganization(columnUuid));
          }
        })
      );
    }
  }

  public onExcelExport(exportAll: boolean) {
    if (this.grid) {
      this.exportAll = exportAll;
      this.grid.saveAsExcel();
    }
  }

  public allData(): ExcelExportData {
    if (!this.data || !this.state) {
      return { data: [] };
    }
    const data = this.data.data ? this.data.data : [];
    const processedData = process(data, { ...this.state, skip: 0, take: data.length });
    const result: ExcelExportData = {
      data: processedData.data,
    };
    return result;
  }

  public getFilteredExportColumns() {
    return this.columns$.pipe(
      map(columns$ => columns$ ? columns$.filter(column => !this.exportAll && column.hidden) : [])
    );
  }
}
