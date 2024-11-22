import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { combineLatestWith, first } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import {
  ARCHIVE_SECTION_NAME,
  CATALOG_COLUMNS_ID,
  CATALOG_SECTION_NAME,
  KLE_SECTION_NAME,
  REFERENCE_SECTION_NAME,
} from 'src/app/shared/constants/persistent-state-constants';
import { accessModifierOptions } from 'src/app/shared/models/access-modifier.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { archiveDutyRecommendationChoiceOptions } from 'src/app/shared/models/it-system/archive-duty-recommendation-choice.model';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectITSystemUsageHasCreateCollectionPermission } from 'src/app/store/it-system-usage/selectors';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import {
  selectITSystemHasCreateCollectionPermission,
  selectSystemGridColumns,
  selectSystemGridData,
  selectSystemGridLoading,
  selectSystemGridState,
} from 'src/app/store/it-system/selectors';

@Component({
  templateUrl: './it-system-catalog.component.html',
  styleUrl: './it-system-catalog.component.scss',
})
export class ItSystemCatalogComponent extends BaseOverviewComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectSystemGridLoading);
  public readonly gridData$ = this.store.select(selectSystemGridData);
  public readonly gridState$ = this.store.select(selectSystemGridState);
  public readonly gridColumns$ = this.store.select(selectSystemGridColumns);

  public readonly hasCreatePermission$ = this.store.select(selectITSystemHasCreateCollectionPermission);
  public readonly hasCreateUsagePermission$ = this.store.select(selectITSystemUsageHasCreateCollectionPermission);

  private readonly systemSectionName = CATALOG_SECTION_NAME;
  public readonly defaultGridColumns: GridColumn[] = [
    {
      field: 'IsInUse',
      idField: 'Uuid',
      title: $localize`Anvendes`,
      width: 100,
      section: this.systemSectionName,
      noFilter: true,
      hidden: false,
      style: 'checkbox',
      permissionsField: 'CanChangeUsageStatus',
    },
    {
      field: 'Parent.Name',
      title: $localize`Overordnet IT System`,
      section: this.systemSectionName,
      width: 320,
      hidden: true,
    },
    {
      field: 'PreviousName',
      title: $localize`Tidligere Systemnavn`,
      section: this.systemSectionName,
      width: 320,
      hidden: false,
    },
    {
      field: 'Name',
      title: $localize`IT systemnavn`,
      section: this.systemSectionName,
      style: 'primary',
      hidden: false,
      required: true,
    },
    {
      field: 'ExternalUuid',
      title: $localize`IT-System (Eksternt UUID)`,
      section: this.systemSectionName,
      hidden: true,
    },
    {
      field: 'AccessModifier',
      title: $localize`Synlighed`,
      section: this.systemSectionName,
      extraFilter: 'enum',
      style: 'enum',
      extraData: accessModifierOptions,
      hidden: true,
    },
    {
      field: 'BusinessType.Name',
      title: $localize`Forretningstype`,
      section: this.systemSectionName,
      hidden: false,
    },
    { field: 'BelongsTo.Name', title: $localize`Rettighedshaver`, section: this.systemSectionName, hidden: false },
    {
      field: 'KLEIds',
      title: $localize`KLE ID`,
      section: KLE_SECTION_NAME,
      filter: 'text',
      hidden: true,
    },
    {
      field: 'KLENames',
      title: $localize`KLE Navn`,
      section: KLE_SECTION_NAME,
      filter: 'text',
      hidden: false,
    },
    {
      field: 'Usages',
      dataField: 'Name',
      title: $localize`IT System: Anvendes af`,
      section: this.systemSectionName,
      style: 'usages',
      entityType: 'it-system',
      hidden: false,
      noFilter: true,
      width: 200,
    },
    {
      field: 'Organization.Name',
      title: $localize`Oprettet af: Organisation`,
      section: this.systemSectionName,
      hidden: true,
    },
    {
      field: 'LastChangedByUser.Name',
      title: $localize`Sidst redigeret: Bruger`,
      section: this.systemSectionName,
      hidden: true,
    },
    {
      field: 'LastChanged',
      title: $localize`Sidst redigeret`,
      section: this.systemSectionName,
      width: 350,
      filter: 'date',
      style: 'date',
      hidden: false,
    },
    {
      field: 'Reference.Title',
      title: $localize`Reference`,
      section: REFERENCE_SECTION_NAME,
      idField: 'Reference.URL',
      style: 'title-link',
      hidden: false,
    },
    {
      field: 'Reference.ExternalReferenceId',
      title: $localize`Dokument ID / Sagsnr.`,
      section: REFERENCE_SECTION_NAME,
      width: 320,
      hidden: true,
    },
    { field: 'Uuid', title: $localize`UUID`, section: this.systemSectionName, hidden: true, width: 320 },
    { field: 'Description', title: $localize`Beskrivelse`, section: this.systemSectionName, hidden: true },
    {
      field: 'ArchiveDuty',
      title: $localize`Rigsarkivets vejledning til arkivering`,
      section: ARCHIVE_SECTION_NAME,
      extraFilter: 'enum',
      style: 'enum',
      extraData: archiveDutyRecommendationChoiceOptions,
      hidden: true,
      width: 360,
    },
    {
      field: 'ArchiveDutyComment',
      title: $localize`Bemærkning fra Rigsarkivet`,
      section: ARCHIVE_SECTION_NAME,
      hidden: true,
    },
  ];

  constructor(
    store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private actions$: Actions,
    private gridColumnStorageService: GridColumnStorageService
  ) {
    super(store, 'it-system');
  }

  ngOnInit(): void {
    this.store.dispatch(ITSystemActions.getITSystemCollectionPermissions());
    this.store.dispatch(ITSystemUsageActions.getITSystemUsageCollectionPermissions());

    const existingColumns = this.gridColumnStorageService.getColumns(CATALOG_COLUMNS_ID, this.defaultGridColumns);
    if (existingColumns) {
      this.store.dispatch(ITSystemActions.updateGridColumns(existingColumns));
    } else {
      this.store.dispatch(ITSystemActions.updateGridColumns(this.defaultGridColumns));
    }

    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemActions.createItSystemSuccess), combineLatestWith(this.gridState$))
        .subscribe(([_, gridState]) => {
          this.stateChange(gridState);
        })
    );

    this.updateUnclickableColumns(this.defaultGridColumns);
    this.subscriptions.add(this.gridColumns$.subscribe((columns) => this.updateUnclickableColumns(columns)));
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITSystemActions.updateGridState(gridState));
  }
  override rowIdSelect(event: CellClickEvent) {
    super.rowIdSelect(event, this.router, this.route);
  }
}
