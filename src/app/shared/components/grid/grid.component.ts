import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import {
  CellClickEvent,
  ColumnReorderEvent,
  ColumnResizeArgs,
  ExcelExportEvent,
  GridComponent as KendoGridComponent,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
  isCompositeFilterDescriptor,
  process,
  SortDescriptor,
} from '@progress/kendo-data-query';
import { cloneDeep, get } from 'lodash';
import { combineLatest, first, map, Observable, of } from 'rxjs';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { GridActions } from 'src/app/store/grid/actions';
import { selectExportAllColumns, selectReadyToExport } from 'src/app/store/grid/selectors';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { BaseComponent } from '../../base/base.component';
import {
  DEFAULT_COLUMN_MINIMUM_WIDTH,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_DATE_COLUMN_MINIMUM_WIDTH,
  DEFAULT_DATE_COLUMN_WIDTH,
  DEFAULT_PRIMARY_COLUMN_MINIMUM_WIDTH,
  GRID_ROW_HEIGHT,
} from '../../constants/constants';
import { includedColumnInExport } from '../../helpers/grid-export.helper';
import { getApplyFilterAction, getSaveFilterAction } from '../../helpers/grid-filter.helpers';
import { GridColumn } from '../../models/grid-column.model';
import { GridData } from '../../models/grid-data.model';
import { DEFAULT_VIRTUALIZTION_PAGE_SIZE, GridState } from '../../models/grid-state.model';
import { SavedFilterState } from '../../models/grid/saved-filter-state.model';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { UIConfigGridApplication } from '../../models/ui-config/ui-config-grid-application';
import { DialogOpenerService } from '../../services/dialog-opener.service';
import { StatePersistingService } from '../../services/state-persisting.service';
import { GridUIConfigService } from '../../services/ui-config-services/grid-ui-config.service';

@Component({
  selector: 'app-grid',
  templateUrl: 'grid.component.html',
  styleUrls: ['grid.component.scss'],
})
export class GridComponent<T> extends BaseComponent implements OnInit, OnChanges {
  @ViewChild(KendoGridComponent) grid?: KendoGridComponent;
  @Input() data$!: Observable<GridData | null>;
  @Input() columns$!: Observable<GridColumn[] | null>;
  @Input() uiConfigApplications$?: Observable<UIConfigGridApplication[]> | null = null;
  @Input() loading: boolean | null = false;
  @Input() entityType!: RegistrationEntityTypes;

  @Input() state?: GridState | null;
  @Input() exportToExcelName?: string | null;

  @Input() createPermission?: boolean | null;
  @Input() modifyPermission?: boolean | null;
  @Input() deletePermission?: boolean | null;

  @Output() stateChange = new EventEmitter<GridState>();
  @Output() rowIdSelect = new EventEmitter<CellClickEvent>();
  @Output() deleteEvent = new EventEmitter<T>();
  @Output() modifyEvent = new EventEmitter<T>();

  private data: GridData | null = null;
  private readonly RolesExtraDataLabel = 'roles';
  private readonly EmailColumnField = '.email';

  public readonly virtualPageSize = DEFAULT_VIRTUALIZTION_PAGE_SIZE;

  public readyToExport$ = this.store.select(selectReadyToExport);
  public exportAllColumns$ = this.store.select(selectExportAllColumns);
  public displayedColumns?: string[];
  public dataSource = new MatTableDataSource<T>();

  public readonly defaultColumnWidth = DEFAULT_COLUMN_WIDTH;
  public readonly defaultMinimumColumnWidth = DEFAULT_COLUMN_MINIMUM_WIDTH;
  public readonly defaultDateColumnWidth = DEFAULT_DATE_COLUMN_WIDTH;
  public readonly defaultPrimaryColumnMinimumWidth = DEFAULT_PRIMARY_COLUMN_MINIMUM_WIDTH;
  public readonly defaultMinimumDateColumnWidth = DEFAULT_DATE_COLUMN_MINIMUM_WIDTH;
  public readonly gridRowHeight = GRID_ROW_HEIGHT;

  constructor(
    private actions$: Actions,
    private store: Store,
    private localStorage: StatePersistingService,
    private gridUIConfigService: GridUIConfigService,
    private dialogOpenerService: DialogOpenerService
  ) {
    super();
    this.allData = this.allData.bind(this);
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.readyToExport$.subscribe((ready) => {
        if (ready) {
          this.excelExport();
        }
      })
    );
    this.subscriptions.add(
      this.data$.subscribe((data) => {
        this.data = data;
      })
    );

    this.initializeFilterSubscriptions();

    const resetGridAction = this.getResetGridConfigAction();

    if (resetGridAction) {
      this.subscriptions.add(
        this.actions$.pipe(ofType(resetGridAction)).subscribe(() => {
          this.store.dispatch(getApplyFilterAction(this.entityType)({ filter: undefined, sort: undefined }));
        })
      );
    }

    const sort: SortDescriptor[] = this.getLocalStorageSort();
    if (!sort) return;
    this.subscriptions.add(
      this.columns$.pipe(first()).subscribe((columns) => {
        //This check prevents stale state from being used to sort the grid
        const columnToBeSorted = columns?.find((column) => column.field === sort[0].field);
        if (!columnToBeSorted || columnToBeSorted.sortable === false) return;
        this.onSortChange(sort);
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

  public onFilterChange(filter: CompositeFilterDescriptor | undefined) {
    const take = this.state?.all === true ? this.data?.total : this.state?.take;
    this.onStateChange({ ...this.state, skip: 0, take, filter });
  }

  public onSortChange(sort: SortDescriptor[] | undefined) {
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
    if (event.length > 0) {
      const columnsCopy = cloneDeep(columns);
      const changedColumnEvent = event[0];
      const columnIndex = columnsCopy.findIndex(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (column) => column.field === (changedColumnEvent.column as any).field
      );
      if (columnIndex === -1) return;

      const columnToChangeWidth = columnsCopy[columnIndex];
      columnToChangeWidth.width = changedColumnEvent.newWidth;

      this.dispatchUpdateColumnsAction(columnsCopy);
    }
  }

  public onCellClick(event: CellClickEvent) {
    this.rowIdSelect.emit(event);
  }

  public onModifyClick(item: T) {
    this.modifyEvent.emit(item);
  }

  public onDeleteClick(item: T) {
    this.deleteEvent.emit(item);
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

  public onExcelExport(e: ExcelExportEvent) {
    e.workbook.sheets[0].title = this.exportToExcelName;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchProperty(object: any, property: string) {
    return get(object, property);
  }

  public checkboxChange(value: boolean | undefined, columnUuid?: string) {
    if (!columnUuid) return;
    if (value === true) {
      switch (this.entityType) {
        case 'it-system':
          this.store.dispatch(ITSystemUsageActions.createItSystemUsage(columnUuid));
          break;
        default:
          throw `Checkbox change for entity type ${this.entityType} not implemented: grid.component.ts`;
      }
    } else {
      switch (this.entityType) {
        case 'it-system':
          this.handleTakeSystemOutOfUse(columnUuid);
          break;
        default:
          throw `Checkbox change for entity type ${this.entityType} not implemented: grid.component.ts`;
      }
    }
  }

  private handleTakeSystemOutOfUse(columnUuid: string | undefined) {
    const dialogRef = this.dialogOpenerService.openTakeSystemOutOfUseDialog();
    this.subscriptions.add(
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result && columnUuid !== undefined) {
          this.store.dispatch(ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganization(columnUuid));
        }
      })
    );
  }

  private excelExport(): void {
    if (this.grid) {
      this.grid.saveAsExcel();
      this.store.dispatch(GridActions.exportCompleted({ ...this.state, all: false }, this.entityType));
    }
  }

  public allData(): ExcelExportData {
    if (!this.data || !this.state) {
      return { data: [] };
    }
    this.subscriptions.add(
      this.data$.pipe(first()).subscribe((data) => {
        this.data = data;
      })
    );
    const processedData = process(this.data.data, { skip: 0, take: this.data.total });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedData = processedData.data.map((item: any) => {
      const transformedItem = { ...item };
      let exportColumns: GridColumn[] = [];
      this.getFilteredExportColumns$()
        .pipe(first())
        .subscribe((columns) => {
          exportColumns = columns;
        });
      exportColumns.forEach((column) => {
        const field = column.field;
        if (field) {
          switch (column.style) {
            case 'chip':
              if (typeof transformedItem[field] === 'boolean') {
                const boolValue = transformedItem[field] ? 0 : 1;
                transformedItem[field] = column.extraData[boolValue].name;
              }
              break;
            case 'enum':
              if (typeof transformedItem[field] === 'object') {
                const enumValue = transformedItem[field];
                transformedItem[field] = enumValue.name;
              }
              break;
            case 'uuid-to-name':
              transformedItem[field] = transformedItem[`${column.dataField}`];
              break;
            case 'excel-only': {
              if (transformedItem.RoleEmails) {
                const roleEmailKeys: string[] = Object.keys(transformedItem.RoleEmails);
                roleEmailKeys.forEach((key) => {
                  const prefixedKey = `Roles.${key}`;
                  if (prefixedKey === field) {
                    transformedItem[`${column.title}`] = transformedItem.RoleEmails[key];
                  }
                });
              }
              break;
            }
            case 'page-link-array':
              {
                const array = transformedItem[column.dataField as string];
                const excelValue = array.map((item: { value: string }) => item.value).join(', ');
                transformedItem[field] = excelValue;
              }
              break;
            case 'usages':
              {
                const usages = transformedItem[column.field as string];
                transformedItem[field] = usages.length;
              }
              break;
            default:
              break;
          }
        }
      });
      return transformedItem;
    });

    return { data: formattedData };
  }

  public getFilteredExportColumns$() {
    return combineLatest([this.columns$, this.exportAllColumns$, this.uiConfigApplications$ ?? of([])]).pipe(
      map(([columns, exportAllColumns, uiConfigApplications]) => {
        const columnsToExport = columns
          ? columns
              .filter(includedColumnInExport)
              .filter((column) => exportAllColumns || !column.hidden || this.isExcelOnlyColumn(column))
              .filter((column) => this.isColumnEnabled(uiConfigApplications, column))
          : [];

        const roleColumnsInExport = columnsToExport.filter((column) => column.extraData === this.RolesExtraDataLabel);
        const roleColumnFieldsToExport = new Set(roleColumnsInExport.map((column) => column.field));
        return columnsToExport.filter(
          (column) =>
            !this.isExcelOnlyColumn(column) ||
            roleColumnFieldsToExport.has(column.field.replaceAll(this.EmailColumnField, ''))
        );
      })
    );
  }

  public isColumnEnabled(applications: true | UIConfigGridApplication[], column: GridColumn): boolean {
    if (applications === true) return true;

    return this.gridUIConfigService.isColumnEnabled(column, applications);
  }

  public totalDataAmount(): number {
    return this.data?.total ?? 0;
  }

  private isExcelOnlyColumn(column: GridColumn): boolean {
    return column.style === 'excel-only';
  }

  public getExportName(): string {
    return this.exportToExcelName ? this.exportToExcelName : 'Export.xlsx';
  }

  private getLocalStorageSort(): SortDescriptor[] {
    return this.localStorage.get(this.localStorageSortKey());
  }

  private setLocalStorageSort(sort: SortDescriptor[] | undefined) {
    this.localStorage.set(this.localStorageSortKey(), sort);
  }

  private localStorageSortKey(): string {
    return this.entityType + '-sort';
  }

  private initializeFilterSubscriptions() {
    this.subscriptions.add(
      this.actions$.pipe(ofType(getSaveFilterAction(this.entityType))).subscribe(({ localStoreKey }) => {
        this.saveFilter(localStoreKey);
      })
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(getApplyFilterAction(this.entityType))).subscribe(({ state }) => {
        const newState = {
          ...this.state,
          filter: this.mapCompositeFilterStringDatesToDateObjects(state.filter),
          sort: state.sort,
        };
        this.onStateChange(newState);
      })
    );
  }

  private mapCompositeFilterStringDatesToDateObjects(
    filter: CompositeFilterDescriptor | undefined
  ): CompositeFilterDescriptor | undefined {
    if (!filter) return undefined;
    return {
      filters: filter.filters.map((filter) => {
        if (isCompositeFilterDescriptor(filter)) {
          return this.mapCompositeFilterStringDatesToDateObjects(filter);
        }
        if (this.isDateFilter(filter)) {
          return {
            ...filter,
            value: new Date(filter.value),
          };
        }
        return filter;
      }),
      logic: filter.logic,
    } as CompositeFilterDescriptor;
  }

  private isDateFilter(filter: FilterDescriptor): boolean {
    return filter.operator === 'gte' || filter.operator === 'lte';
  }

  private saveFilter(localStoreKey: string) {
    this.localStorage.set<SavedFilterState>(localStoreKey, { filter: this.state?.filter, sort: this.state?.sort });
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
      case 'organization-user':
        this.store.dispatch(OrganizationUserActions.updateGridColumns(columns));
        break;
      default:
        throw `Column reorder for entity type ${this.entityType} not implemented: grid.component.ts`;
    }
  }

  private getResetGridConfigAction() {
    switch (this.entityType) {
      case 'it-system-usage':
        return ITSystemUsageActions.resetToOrganizationITSystemUsageColumnConfiguration;
      case 'it-contract':
        return ITContractActions.resetToOrganizationITContractColumnConfiguration;
      case 'data-processing-registration':
        return DataProcessingActions.resetToOrganizationDataProcessingColumnConfiguration;
      case 'organization-user':
        return OrganizationUserActions.resetGridConfiguration;
      default:
        return undefined;
    }
  }
}
