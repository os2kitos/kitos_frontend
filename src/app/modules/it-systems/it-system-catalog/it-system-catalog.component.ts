import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { combineLatestWith, debounceTime, first } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { BooleanValueDisplayType } from 'src/app/shared/components/status-chip/status-chip.component';
import { DEFAULT_INPUT_DEBOUNCE_TIME } from 'src/app/shared/constants/constants';
import * as CatalogFields from 'src/app/shared/constants/it-system-catalog-grid-column-constants';
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
import { CheckboxChange } from 'src/app/shared/models/grid/grid-events.model';
import { archiveDutyRecommendationChoiceOptions } from 'src/app/shared/models/it-system/archive-duty-recommendation-choice.model';
import { DialogOpenerService } from 'src/app/shared/services/dialog-opener.service';
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
      field: CatalogFields.IS_IN_USE,
      idField: CatalogFields.UUID,
      title: $localize`Anvendes`,
      width: 100,
      section: this.systemSectionName,
      noFilter: true,
      hidden: false,
      style: 'checkbox',
      permissionsField: 'CanChangeUsageStatus',
      sortable: false,
    },
    {
      field: CatalogFields.DISABLED,
      title: $localize`Status`,
      section: this.systemSectionName,
      filter: 'boolean',
      entityType: 'it-system',
      minResizableWidth: 140,
      extraData: [
        {
          name: $localize`Tilgængelig`,
          value: false,
        },
        {
          name: $localize`Ikke tilgængelig`,
          value: true,
        },
      ],
      booleanValueDisplay: BooleanValueDisplayType.AvailableNotAvailable,
      style: 'reverse-chip',
      hidden: false,
      persistId: 'isActive',
    },
    {
      field: CatalogFields.PARENT_NAME,
      title: $localize`Overordnet IT System`,
      section: this.systemSectionName,
      width: 320,
      hidden: true,
    },
    {
      field: CatalogFields.PREVIOUS_NAME,
      title: $localize`Tidligere Systemnavn`,
      section: this.systemSectionName,
      width: 320,
      hidden: false,
    },
    {
      field: CatalogFields.NAME,
      title: $localize`IT systemnavn`,
      section: this.systemSectionName,
      style: 'primary',
      hidden: false,
      required: true,
    },
    {
      field: CatalogFields.EXTERNAL_UUID,
      title: $localize`IT-System (Eksternt UUID)`,
      section: this.systemSectionName,
      hidden: true,
    },
    {
      field: CatalogFields.ACCESS_MODIFIER,
      title: $localize`Synlighed`,
      section: this.systemSectionName,
      extraFilter: 'enum',
      style: 'enum',
      extraData: accessModifierOptions,
      hidden: true,
    },
    {
      field: CatalogFields.BUSINESS_TYPE_NAME,
      title: $localize`Forretningstype`,
      section: this.systemSectionName,
      hidden: false,
    },
    { field: 'BelongsTo.Name', title: $localize`Rettighedshaver`, section: this.systemSectionName, hidden: false },
    {
      field: CatalogFields.KLE_IDS,
      title: $localize`KLE ID`,
      section: KLE_SECTION_NAME,
      filter: 'text',
      hidden: true,
      sortable: false,
    },
    {
      field: CatalogFields.KLE_NAMES,
      title: $localize`KLE Navn`,
      section: KLE_SECTION_NAME,
      filter: 'text',
      hidden: false,
      sortable: false,
    },
    {
      field: CatalogFields.USAGES,
      dataField: 'Name',
      idField: CatalogFields.UUID,
      title: $localize`IT System: Anvendes af`,
      section: this.systemSectionName,
      style: 'usages',
      entityType: 'it-system',
      hidden: false,
      noFilter: true,
      width: 200,
      sortable: false,
    },
    {
      field: CatalogFields.ORGANIZATION_NAME,
      title: $localize`Oprettet af: Organisation`,
      section: this.systemSectionName,
      hidden: true,
    },
    {
      field: CatalogFields.LAST_CHANGED_BY_USER_NAME,
      title: $localize`Sidst redigeret: Bruger`,
      section: this.systemSectionName,
      hidden: true,
    },
    {
      field: CatalogFields.LAST_CHANGED,
      title: $localize`Sidst redigeret`,
      section: this.systemSectionName,
      width: 350,
      filter: 'date',
      style: 'date',
      hidden: false,
    },
    {
      field: CatalogFields.REFERENCE_TITLE,
      title: $localize`Reference`,
      section: REFERENCE_SECTION_NAME,
      idField: CatalogFields.REFERENCE_URL,
      style: 'title-link',
      hidden: false,
    },
    {
      field: CatalogFields.REFERENCE_EXTERNAL_REFERENCE_ID,
      title: $localize`Dokument ID / Sagsnr.`,
      section: REFERENCE_SECTION_NAME,
      width: 320,
      hidden: true,
    },
    { field: CatalogFields.UUID, title: $localize`UUID`, section: this.systemSectionName, hidden: true, width: 320 },
    { field: CatalogFields.DESCRIPTION, title: $localize`Beskrivelse`, section: this.systemSectionName, hidden: true },
    {
      field: CatalogFields.ARCHIVE_DUTY,
      title: $localize`Rigsarkivets vejledning til arkivering`,
      section: ARCHIVE_SECTION_NAME,
      extraFilter: 'enum',
      style: 'enum',
      extraData: archiveDutyRecommendationChoiceOptions,
      hidden: true,
      width: 360,
    },
    {
      field: CatalogFields.ARCHIVE_DUTY_COMMENT,
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
    private gridColumnStorageService: GridColumnStorageService,
    private dialogOpenerService: DialogOpenerService
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

    this.subscriptions.add(this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState)));

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemActions.createItSystemSuccess), combineLatestWith(this.gridState$))
        .subscribe(([_, gridState]) => {
          this.stateChange(gridState);
        })
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(ITSystemActions.executeUsageMigrationSuccess)).subscribe(() => {
        location.reload();
      })
    );

    this.updateUnclickableColumns(this.defaultGridColumns);
    this.subscriptions.add(this.gridColumns$.subscribe((columns) => this.updateUnclickableColumns(columns)));

    this.subscriptions.add(
      this.actions$.pipe(ofType(ITSystemActions.resetGridConfiguration)).subscribe(() => this.updateDefaultColumns())
    );
  }

  public handleSystemUsageChange(event: CheckboxChange) {
    const rowEntityUuid = event.rowEntityUuid;
    if (!rowEntityUuid) return;

    if (event.value === true) {
      this.handleTakeSystemIntoUse(rowEntityUuid);
    } else {
      this.handleTakeSystemOutOfUse(rowEntityUuid);
    }
  }

  private handleTakeSystemIntoUse(systemUuid: string) {
    this.store.dispatch(ITSystemUsageActions.createItSystemUsage(systemUuid));
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(ITSystemUsageActions.createItSystemUsageSuccess),
          first(),
          debounceTime(DEFAULT_INPUT_DEBOUNCE_TIME),
          concatLatestFrom(() => this.gridState$)
        )
        .subscribe(([_, gridState]) => this.dispatchGetSystemsOnDataUpdate(gridState))
    );
  }

  private handleTakeSystemOutOfUse(systemUuid: string) {
    const dialogRef = this.dialogOpenerService.openTakeSystemOutOfUseDialog();
    this.subscriptions.add(
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result && systemUuid !== undefined) {
          this.store.dispatch(ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganization(systemUuid));
        }
      })
    );

    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganizationSuccess),
          first(),
          debounceTime(DEFAULT_INPUT_DEBOUNCE_TIME),
          concatLatestFrom(() => this.gridState$)
        )
        .subscribe(([_, gridState]) => this.dispatchGetSystemsOnDataUpdate(gridState))
    );
  }

  private dispatchGetSystemsOnDataUpdate(gridState: GridState | undefined) {
    if (gridState) {
      this.store.dispatch(ITSystemActions.updateGridDataFromGrid(gridState));
    }
  }

  private updateDefaultColumns(): void {
    this.store.dispatch(ITSystemActions.updateGridColumns(this.defaultGridColumns));
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITSystemActions.updateGridState(gridState));
  }
  override rowIdSelect(event: CellClickEvent) {
    super.rowIdSelect(event, this.router, this.route);
  }
}
