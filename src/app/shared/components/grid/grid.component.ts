import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import {
  CellClickEvent,
  ColumnReorderEvent,
  ColumnResizeArgs,
  GridComponent as KendoGridComponent,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, process, SortDescriptor } from '@progress/kendo-data-query';
import { get } from 'lodash';
import { combineLatest, first, map, Observable } from 'rxjs';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { GridExportActions } from 'src/app/store/grid/actions';
import { selectExportAllColumns, selectReadyToExport } from 'src/app/store/grid/selectors';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { BaseComponent } from '../../base/base.component';
import { GridColumn } from '../../models/grid-column.model';
import { GridData } from '../../models/grid-data.model';
import { GridState } from '../../models/grid-state.model';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { StatePersistingService } from '../../services/state-persisting.service';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-grid',
  templateUrl: 'grid.component.html',
  styleUrls: ['grid.component.scss'],
})
export class GridComponent<T> extends BaseComponent implements OnInit, OnChanges {
  @ViewChild(KendoGridComponent) grid?: KendoGridComponent;
  @Input() data$!: Observable<GridData | null>;
  @Input() columns$!: Observable<GridColumn[] | null>;
  @Input() loading: boolean | null = false;
  @Input() entityType!: RegistrationEntityTypes;

  @Input() state?: GridState | null;
  @Input() exportToExcelName?: string | null;

  @Output() stateChange = new EventEmitter<GridState>();
  @Output() rowIdSelect = new EventEmitter<CellClickEvent>();

  private data: GridData | null = null;

  public readyToExport$ = this.store.select(selectReadyToExport);
  public exportAllColumns$ = this.store.select(selectExportAllColumns);
  public displayedColumns?: string[];
  public dataSource = new MatTableDataSource<T>();

  public readonly defaultColumnWidth = 270;

  constructor(private store: Store, private dialog: MatDialog, private localStorage: StatePersistingService) {
    super();
    this.allData = this.allData.bind(this);
  }

  ngOnInit(): void {
    const sort: SortDescriptor[] = this.getLocalStorageSort();
    if (sort) {
      this.onSortChange(sort);
    }

    this.subscriptions.add(
      this.readyToExport$.subscribe((ready) => {
        if (ready) this.excelExport();
      })
    );
    this.subscriptions.add(
      this.data$.subscribe((data) => {
        this.data = data;
      })
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    //Set state take for Kendo grid to correctly calculate page size and page numbers
    if (changes['data'] && this.state?.all === true) {
      this.state = { ...this.state, take: this.data?.total };
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
    this.setLocalStorageSort(sort);
  }

  public onPageChange(event: PageChangeEvent) {
    this.onStateChange({ ...this.state, skip: event.skip, take: event.take });
  }

  public onPageSizeChange(pageSize?: number) {
    const take = pageSize ?? this.data?.total;
    this.onStateChange({ ...this.state, skip: 0, take, all: pageSize ? false : true });
  }

  public onResizeChange(event: ColumnResizeArgs[], columns: GridColumn[]) {
    const columnsCopy = [...columns];
    if (event.length > 0) {
      const changedColumnEvent = event[0];
      const columnIndex = columnsCopy.findIndex(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (column) => column.field === (changedColumnEvent.column as any).field
      );
      if (columnIndex === -1) return;

      // Create a copy of the column to change
      const columnToChangeWidth = { ...columnsCopy[columnIndex] };
      // Change the width of the copied column
      columnToChangeWidth.width = changedColumnEvent.newWidth;
      // Replace the original column with the modified copy
      columnsCopy[columnIndex] = columnToChangeWidth;

      this.dispatchUpdateColumnsAction(columnsCopy);
    }
  }

  public onCellClick(event: CellClickEvent) {
    this.rowIdSelect.emit(event);
  }

  public onColumnReorder(event: ColumnReorderEvent, columns: GridColumn[]) {
    const columnsCopy = [...columns];
    const columnsWithoutHidden = columnsCopy.filter((column) => !column.hidden);
    const targetColumn = columnsWithoutHidden[event.newIndex];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columnToMove = columnsCopy.find((column) => column.field === (event.column as any).field);

    if (columnToMove) {
      const oldIndex = columnsCopy.indexOf(columnToMove);
      const newIndex = columnsCopy.indexOf(targetColumn);
      columnsCopy.splice(oldIndex, 1); // Remove the column from its old position
      columnsCopy.splice(newIndex, 0, columnToMove); // Insert the column at the new position

      this.dispatchUpdateColumnsAction(columnsCopy);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchProperty(object: any, property: string) {
    return get(object, property);
  }

  public checkboxChange(value: boolean | undefined, columnUuid?: string) {
    if (!columnUuid) return;
    if (value === true) {
      switch (this.entityType) {
        case 'it-system-usage':
          this.store.dispatch(ITSystemUsageActions.createItSystemUsage(columnUuid));
          break;
        default:
          throw `Checkbox change for entity type ${this.entityType} not implemented: grid.component.ts`;
      }
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent);
      const dialogInstance = dialogRef.componentInstance;
      dialogInstance.bodyText = $localize`Er du sikker på at du vil fjerne den lokale anvendelse af systemet? Dette sletter ikke systemet, men vil slette alle lokale detaljer vedrørende anvendelsen.`;
      dialogInstance.confirmColor = 'warn';

      this.subscriptions.add(
        dialogRef.afterClosed().subscribe((result) => {
          if (result === true) {
            switch (this.entityType) {
              case 'it-system-usage':
                this.store.dispatch(ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganization(columnUuid));
                break;
              default:
                throw `Checkbox change for entity type ${this.entityType} not implemented: grid.component.ts`;
            }
          }
        })
      );
    }
  }

  private excelExport(): void {
    if (this.grid) {
      this.grid.saveAsExcel();
      this.store.dispatch(GridExportActions.exportCompleted({ all: false }));
    }
  }

  public allData(): ExcelExportData {
    if (!this.data || !this.state) {
      return { data: [] };
    }
    this.data$.pipe(first()).subscribe((data) => {
      this.data = data;
    });
    const processedData = process(this.data.data, { ...this.state, skip: 0, take: this.data.total });
    return { data: processedData.data };
  }

  public getFilteredExportColumns() {
    return combineLatest([this.columns$, this.exportAllColumns$]).pipe(
      map(([columns, exportAllColumns]) => {
        return columns ? columns.filter((column) => exportAllColumns || !column.hidden) : [];
      })
    );
  }

  public getExportName(): string {
    return this.exportToExcelName ? this.exportToExcelName : 'Export.xlsx';
  }

  private getLocalStorageSort(): SortDescriptor[] {
    return this.localStorage.get(this.localStorageSortKey());
  }

  private setLocalStorageSort(sort: SortDescriptor[]) {
    this.localStorage.set(this.localStorageSortKey(), sort);
  }

  private localStorageSortKey(): string {
    return this.entityType + '-sort';
  }

  private dispatchUpdateColumnsAction(columns: GridColumn[]) {
    switch (this.entityType) {
      case 'it-system-usage':
        this.store.dispatch(ITSystemUsageActions.updateGridColumns(columns));
        break;
      case 'it-contract':
        this.store.dispatch(ITContractActions.updateGridColumns(columns));
        break;
      case 'it-system':
        this.store.dispatch(ITSystemActions.updateGridColumns(columns));
        break;
      case 'it-interface':
        this.store.dispatch(ITInterfaceActions.updateGridColumns(columns));
        break;
      case 'data-processing-registration':
        this.store.dispatch(DataProcessingActions.updateGridColumns(columns));
        break;
      default:
        throw `Column reorder for entity type ${this.entityType} not implemented: grid.component.ts`;
    }
  }
}
