import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { first } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { ARCHIVE_SECTION_NAME, USAGE_ARCHIVE_COLUMNS_ID } from 'src/app/shared/constants/persistent-state-constants';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { GridActions } from 'src/app/store/grid/actions';
import { ITSystemUsageArchiveActions } from 'src/app/store/it-system-usage-archive/actions';
import {
  selectUsageArchiveGridColumns,
  selectUsageArchiveGridData,
  selectUsageArchiveGridState,
  selectUsageArchiveIsLoading,
} from 'src/app/store/it-system-usage-archive/selectors';
import { ExportMenuButtonComponent } from '../../../shared/components/buttons/export-menu-button/export-menu-button.component';
import { GridOptionsButtonComponent } from '../../../shared/components/grid-options-button/grid-options-button.component';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { HideShowButtonComponent } from '../../../shared/components/grid/hide-show-button/hide-show-button.component';
import { OverviewHeaderComponent } from '../../../shared/components/overview-header/overview-header.component';

@Component({
  templateUrl: './it-system-usage-archive.component.html',
  styleUrl: './it-system-usage-archive.component.scss',
  selector: 'app-it-system-usage-archive',
  standalone: true,
  imports: [
    CommonModule,
    OverviewHeaderComponent,
    GridOptionsButtonComponent,
    ExportMenuButtonComponent,
    HideShowButtonComponent,
    GridComponent,
    AsyncPipe,
  ],
})
export class ItSystemUsageArchiveComponent extends BaseOverviewComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectUsageArchiveIsLoading);
  public readonly gridData$ = this.store.select(selectUsageArchiveGridData);
  public readonly gridState$ = this.store.select(selectUsageArchiveGridState);
  public readonly gridColumns$ = this.store.select(selectUsageArchiveGridColumns);

  private readonly systemSectionName = ARCHIVE_SECTION_NAME;

  public readonly defaultGridColumns: GridColumn[] = [
    {
      field: 'ArchivingDate',
      title: $localize`Arkiveringsdato`,
      section: this.systemSectionName,
      style: 'date',
      filter: 'date',
      hidden: false,
    },
    {
      field: 'ReferenceName',
      title: $localize`Referencenavn`,
      section: this.systemSectionName,
      hidden: false,
    },
    {
      field: 'SystemUuid',
      title: $localize`IT System UUID`,
      section: this.systemSectionName,
      hidden: false,
    },
    {
      field: 'SystemName',
      title: $localize`Systemnavn`,
      style: 'primary',
      section: this.systemSectionName,
      hidden: false,
    },
    {
      field: 'LocalName',
      title: $localize`Lokalt systemnavn`,
      section: this.systemSectionName,
      hidden: true,
    },
    {
      field: 'LocalId',
      title: $localize`Lokalt system ID`,
      section: this.systemSectionName,
      hidden: true,
    },
    {
      field: 'Note',
      title: $localize`Note`,
      section: this.systemSectionName,
      hidden: true,
    },
  ];

  constructor(
    store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private gridColumnStorageService: GridColumnStorageService,
    private actions$: Actions,
  ) {
    super(store, 'it-system-usage-archive');
  }

  ngOnInit(): void {
    // Initialize grid columns from localStorage
    const columnId = USAGE_ARCHIVE_COLUMNS_ID;
    const localStorageColumns =
      this.gridColumnStorageService.getColumns(columnId, this.defaultGridColumns) || this.defaultGridColumns;
    this.store.dispatch(ITSystemUsageArchiveActions.updateGridColumns(localStorageColumns));

    // Dispatch initial load
    this.subscriptions.add(
      this.gridState$.pipe(first()).subscribe((state) => {
        this.store.dispatch(ITSystemUsageArchiveActions.getITSystemUsageArchives(state));
      }),
    );

    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(ITSystemUsageArchiveActions.deleteITSystemUsageArchiveSuccess),
          concatLatestFrom(() => this.gridState$),
        )
        .subscribe(([_, gridState]) => {
          this.store.dispatch(ITSystemUsageArchiveActions.getITSystemUsageArchives(gridState));
        }),
    );

    this.store.dispatch(ITSystemUsageArchiveActions.getITSystemUsageArchiveCollectionPermissions());
  }

  public stateChange(newState: GridState): void {
    this.store.dispatch(ITSystemUsageArchiveActions.updateGridState(newState));
  }

  public onGridColumnsUpdated(gridColumns: GridColumn[]): void {
    this.store.dispatch(ITSystemUsageArchiveActions.updateGridColumnsSuccess(gridColumns));
  }

  public override rowIdSelect(event: CellClickEvent): void {
    super.rowIdSelect(event, this.router, this.route);
  }

  public override onExcelExport = (exportAllColumns: boolean) => {
    this.gridState$.pipe(first()).subscribe((gridState) => {
      this.store.dispatch(
        GridActions.exportDataFetch(exportAllColumns, { ...gridState, all: true }, 'it-system-usage-archive'),
      );
    });
  };
}
