import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { ExcelExportEvent, GridComponent as KendoGridComponent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, SortDescriptor, process } from '@progress/kendo-data-query';
import { get } from 'lodash';
import { GridExportActions } from 'src/app/store/grid/actions';
import { BaseComponent } from '../../base/base.component';
import { GridColumn } from '../../models/grid-column.model';
import { GridState, defaultGridState } from '../../models/grid-state.model';

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

  @Input() withOutline: boolean = false;

  public state = defaultGridState;

  public readonly defaultColumnWidth = 270;
  public readonly defaultMinimumColumnWidth = 50;
  public readonly defaultDateColumnWidth = 350;

  constructor(private actions$: Actions) {
    super();
    this.allData = this.allData.bind(this);
  }
  ngOnInit(): void {
    this.actions$.pipe(ofType(GridExportActions.exportLocalData)).subscribe(() => this.excelExport());
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

  public allData(): ExcelExportData {
    if (!this.data || !this.state) {
      return { data: [] };
    }
    const processedData = process(this.data, { ...this.state, skip: 0, take: this.data.length });

    return { data: processedData.data };
  }
}
