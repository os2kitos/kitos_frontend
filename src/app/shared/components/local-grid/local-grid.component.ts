import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import {
  ExcelExportEvent,
  GridComponent as KendoGridComponent,
  PageChangeEvent,
  RowReorderEvent,
} from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, SortDescriptor, process } from '@progress/kendo-data-query';
import { get } from 'lodash';
import { GridActions } from 'src/app/store/grid/actions';
import { BaseComponent } from '../../base/base.component';
import {
  DEFAULT_COLUMN_MINIMUM_WIDTH,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_DATE_COLUMN_MINIMUM_WIDTH,
  DEFAULT_DATE_COLUMN_WIDTH,
  DEFAULT_PRIMARY_COLUMN_MINIMUM_WIDTH,
} from '../../constants/constants';
import { includedColumnInExport, transformRow } from '../../helpers/grid-export.helper';
import { GridColumn } from '../../models/grid-column.model';
import { GridState, defaultLocalGridState } from '../../models/grid-state.model';
import { BooleanChange, RowReorderingEvent } from '../../models/grid/grid-events.model';

@Component({
  selector: 'app-local-grid',
  templateUrl: './local-grid.component.html',
  styleUrl: './local-grid.component.scss',
})
export class LocalGridComponent<T> extends BaseComponent implements OnInit {
  @ViewChild(KendoGridComponent) grid?: KendoGridComponent;
  @Input() data!: T[];
  @Input() columns!: GridColumn[];
  @Input() loading: boolean | null = false;
  @Input() exportToExcelName?: string | null;
  @Input() modifyPermission?: boolean | null;
  @Input() deletePermission?: boolean | null;
  @Input() withOutline: boolean = false;
  @Input() fitSizeToContent: boolean = false;
  @Input() reorderable: boolean = false;
  @Input() scrollable: 'scrollable' | 'virtual' | 'none' = 'scrollable';

  @Output() deleteEvent = new EventEmitter<T>();
  @Output() modifyEvent = new EventEmitter<T>();
  @Output() toggleChange = new EventEmitter<BooleanChange<T>>();
  @Output() checkboxChange = new EventEmitter<BooleanChange<T>>();
  @Output() rowReordering = new EventEmitter<RowReorderingEvent<T>>();

  public state = defaultLocalGridState;

  public readonly defaultColumnWidth = DEFAULT_COLUMN_WIDTH;
  public readonly defaultMinimumColumnWidth = DEFAULT_COLUMN_MINIMUM_WIDTH;
  public readonly defaultDateColumnWidth = DEFAULT_DATE_COLUMN_WIDTH;
  public readonly defaultMinimumDateColumnWidth = DEFAULT_DATE_COLUMN_MINIMUM_WIDTH;
  public readonly defaultPrimaryColumnMinimumWidth = DEFAULT_PRIMARY_COLUMN_MINIMUM_WIDTH;

  constructor(private actions$: Actions) {
    super();
    this.allData = this.allData.bind(this);
  }
  ngOnInit(): void {
    this.actions$.pipe(ofType(GridActions.exportLocalData)).subscribe(() => this.excelExport());
  }

  public onModifyClick(item: T) {
    this.modifyEvent.emit(item);
  }

  public onDeleteClick(item: T) {
    this.deleteEvent.emit(item);
  }

  public onStateChange(state: GridState) {
    this.state = state;
  }

  public onFilterChange(filter: CompositeFilterDescriptor | undefined) {
    const take = this.state?.all === true ? this.data?.length : this.state?.take;
    this.onStateChange({ ...this.state, skip: 0, take, filter });
  }

  public onSortChange(sort: SortDescriptor[] | undefined) {
    this.onStateChange({ ...this.state, sort });
  }

  public onPageChange(event: PageChangeEvent) {
    this.onStateChange({ ...this.state, skip: event.skip, take: event.take });
  }

  public onPageSizeChange(pageSize?: number) {
    const take = pageSize ?? this.data?.length;
    this.onStateChange({ ...this.state, skip: 0, take, all: pageSize ? false : true });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchProperty(object: any, property: string) {
    return get(object, property);
  }

  public onExcelExport(e: ExcelExportEvent) {
    e.workbook.sheets[0].title = this.exportToExcelName;
  }

  public getExportName(): string {
    return this.exportToExcelName ? this.exportToExcelName : 'Export.xlsx';
  }

  private excelExport(): void {
    if (this.grid) {
      this.grid.saveAsExcel();
    }
  }

  public getColumnsForExport(): GridColumn[] {
    return this.columns.filter(includedColumnInExport);
  }

  public onToggleChange(value: boolean, item: T) {
    this.toggleChange.emit({ value, item });
  }

  public onCheckboxChange(value: boolean | undefined, item: T) {
    if (value === undefined) return;
    this.checkboxChange.emit({ value, item });
  }

  public allData(): ExcelExportData {
    if (!this.data || !this.state) {
      return { data: [] };
    }
    const processedData = process(this.data, { ...this.state, skip: 0, take: this.data.length });
    const columns = this.getColumnsForExport();
    const transformedData = processedData.data.map((item) => transformRow(item, columns));

    return { data: transformedData };
  }

  public onRowReorder(event: RowReorderEvent) {
    if (!event.draggedRows?.length || !event.dropTargetRow) return;

    const fromRow = event.draggedRows[0];
    const fromIndex = fromRow.rowIndex;

    let toIndex = event.dropTargetRow.rowIndex;

    if (event.dropPosition === 'after') {
      toIndex++;
    }
    if (fromIndex < toIndex) {
      toIndex--;
    }

    toIndex = Math.max(0, Math.min(toIndex, this.data.length - 1));
    const toItem = this.data[toIndex];

    this.rowReordering.emit({
      from: {
        item: fromRow.dataItem,
        index: fromIndex,
      },
      to: {
        item: toItem,
        index: toIndex,
      },
    });
  }
}
