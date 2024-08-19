import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, first } from 'rxjs';
import { isAgreementConcludedOptions } from 'src/app/shared/models/data-processing/is-agreement-concluded.model';
import { isOversightCompletedOptions } from 'src/app/shared/models/data-processing/is-oversight-completed.model';
import { transferToInsecureThirdCountriesOptions } from 'src/app/shared/models/data-processing/transfer-to-insecure-third-countries.model';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { DATA_PROCESSING_COLUMNS_ID, DATA_PROCESSING_SECTION_NAME } from 'src/app/shared/persistent-state-constants';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import {
  selectDataProcessingGridColumns,
  selectDataProcessingGridData,
  selectDataProcessingGridLoading,
  selectDataProcessingGridState,
  selectDataProcessingHasCreateCollectionPermissions,
  selectDataProcessingRoleColumns,
} from 'src/app/store/data-processing/selectors';
import { yearMonthIntervalOptions } from 'src/app/shared/models/data-processing/year-month-interval.model';

@Component({
  selector: 'app-data-processing-overview',
  templateUrl: './data-processing-overview.component.html',
  styleUrl: './data-processing-overview.component.scss',
})
export class DataProcessingOverviewComponent extends BaseOverviewComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectDataProcessingGridLoading);
  public readonly gridData$ = this.store.select(selectDataProcessingGridData);
  public readonly gridState$ = this.store.select(selectDataProcessingGridState);
  public readonly gridColumns$ = this.store.select(selectDataProcessingGridColumns);

  public readonly hasCreatePermission$ = this.store.select(selectDataProcessingHasCreateCollectionPermissions);
  private readonly activeOptions = [
    {
      name: $localize`Aktiv`,
      value: true,
    },
    {
      name: $localize`Ikke aktiv`,
      value: false,
    },
  ];

  public readonly defaultGridColumns: GridColumn[] = [
    {
      field: 'Name',
      title: $localize`Databehandling`,
      section: DATA_PROCESSING_SECTION_NAME,
      style: 'primary',
      hidden: false,
    },
    {
      field: 'IsActive',
      title: $localize`Databehandling status`,
      section: DATA_PROCESSING_SECTION_NAME,
      filter: 'boolean',
      extraData: this.activeOptions,
      entityType: 'data-processing-registration',
      style: 'chip',
      width: 340,
      hidden: true,
    },
    {
      field: 'LastChangedById',
      title: $localize`Sidst ændret ID`,
      section: DATA_PROCESSING_SECTION_NAME,
      filter: 'numeric',
      hidden: true,
    },
    {
      field: 'LastChangedAt',
      title: $localize`Sidst ændret dato`,
      section: DATA_PROCESSING_SECTION_NAME,
      filter: 'date',
      hidden: true,
    },
    {
      field: 'ActiveAccordingToMainContract',
      title: $localize`Status (Markeret kontrakt)`,
      section: DATA_PROCESSING_SECTION_NAME,
      filter: 'boolean',
      extraData: this.activeOptions,
      entityType: 'data-processing-registration',
      style: 'chip',
      width: 340,
      hidden: true,
    },
    {
      field: 'MainReferenceTitle',
      title: $localize`Reference`,
      section: DATA_PROCESSING_SECTION_NAME,
      hidden: true,
    },
    {
      field: 'MainReferenceUserAssignedId',
      title: $localize`Dokument ID / Sagsnr.`,
      section: DATA_PROCESSING_SECTION_NAME,
      hidden: true,
    },
    {
      field: 'SystemNamesAsCsv',
      title: $localize`IT Systemer`,
      section: DATA_PROCESSING_SECTION_NAME,
      hidden: false,
    },
    {
      field: 'SystemUuidsAsCsv',
      title: $localize`IT Systemer (UUID)`,
      section: DATA_PROCESSING_SECTION_NAME,
      hidden: true,
    },
    {
      field: 'DataProcessorNamesAsCsv',
      title: $localize`Databehandlere`,
      section: DATA_PROCESSING_SECTION_NAME,
      hidden: false,
    },
    {
      field: 'SubDataProcessorNamesAsCsv',
      title: $localize`Underdatabehandlere`,
      section: DATA_PROCESSING_SECTION_NAME,
      hidden: true,
    },
    {
      field: 'TransferToInsecureThirdCountries',
      title: $localize`Overførsel til usikkert 3. land`,
      section: DATA_PROCESSING_SECTION_NAME,
      hidden: true,
      style: 'enum',
      extraData: transferToInsecureThirdCountriesOptions,
      extraFilter: 'enum',
      width: 340,
    },
    {
      field: 'BasisForTransferUuid',
      dataField: 'BasisForTransfer',
      title: $localize`Overførselsgrundlag`,
      section: DATA_PROCESSING_SECTION_NAME,
      extraFilter: 'choice-type',
      extraData: 'data-processing-basis-for-transfer-types',
      hidden: true,
      style: 'uuid-to-name',
    },
    {
      field: 'DataResponsibleUuid',
      dataField: 'DataResponsible',
      title: $localize`Dataansvarlig`,
      section: DATA_PROCESSING_SECTION_NAME,
      extraFilter: 'choice-type',
      extraData: 'data-processing-data-responsible-types',
      hidden: true,
      style: 'uuid-to-name',
    },
    {
      field: 'IsAgreementConcluded',
      title: $localize`Databehandleraftale er indgået`,
      section: DATA_PROCESSING_SECTION_NAME,
      style: 'enum',
      extraFilter: 'enum',
      extraData: isAgreementConcludedOptions,
      hidden: true,
    },
    {
      field: 'AgreementConcludedAt',
      title: $localize`Dato for indgåelse af databehandleraftale`,
      section: DATA_PROCESSING_SECTION_NAME,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: true,
    },
    {
      field: 'OversightInterval',
      title: $localize`Tilsynsinterval`,
      section: DATA_PROCESSING_SECTION_NAME,
      hidden: true,
      extraFilter: 'enum',
      style: 'enum',
      extraData: yearMonthIntervalOptions,
    },
    {
      field: 'OversightOptionNamesAsCsv',
      title: $localize`Tilsynsmuligheder`,
      section: DATA_PROCESSING_SECTION_NAME,
      hidden: true,
      extraFilter: 'choice-type-by-name',
      extraData: 'data-processing-oversight-option-types',
    },
    {
      field: 'IsOversightCompleted',
      title: $localize`Gennemført tilsyn`,
      section: DATA_PROCESSING_SECTION_NAME,
      hidden: true,
      extraFilter: 'enum',
      style: 'enum',
      extraData: isOversightCompletedOptions,
    },
    {
      field: 'OversightScheduledInspectionDate',
      title: $localize`Kommende planlagt tilsyn`,
      section: DATA_PROCESSING_SECTION_NAME,
      hidden: true,
      filter: 'date',
      style: 'date',
      width: 350,
    },
    {
      field: 'LatestOversightDate',
      title: $localize`Seneste tilsyn`,
      section: DATA_PROCESSING_SECTION_NAME,
      hidden: true,
      filter: 'date',
      style: 'date',
      width: 350,
    },
    {
      field: 'LastChangedByName',
      title: $localize`Sidst ændret bruger`,
      section: DATA_PROCESSING_SECTION_NAME,
      hidden: true,
    },
    {
      field: 'ContractNamesAsCsv',
      title: $localize`IT Kontrakter`,
      section: DATA_PROCESSING_SECTION_NAME,
      hidden: false,
    },
  ];


  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private actions$: Actions,
    private statePersistingService: StatePersistingService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(DataProcessingActions.getDataProcessingCollectionPermissions());
    this.store.dispatch(DataProcessingActions.getDataProcessingOverviewRoles());

    const localCacheColumns = this.statePersistingService.get<GridColumn[]>(DATA_PROCESSING_COLUMNS_ID);
    if (localCacheColumns) {
      this.store.dispatch(DataProcessingActions.updateGridColumns(localCacheColumns));
    } else {
      this.subscriptions.add(
        this.actions$
          .pipe(
            ofType(DataProcessingActions.getDataProcessingOverviewRolesSuccess),
            combineLatestWith(this.store.select(selectDataProcessingRoleColumns)),
            first()
          )
          .subscribe(([_, gridRoleColumns]) => {
            this.store.dispatch(
              DataProcessingActions.updateGridColumnsAndRoleColumns(this.defaultGridColumns, gridRoleColumns)
            );
          })
      );
    }

    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(DataProcessingActions.createDataProcessingSuccess), combineLatestWith(this.gridState$))
        .subscribe(([_, gridState]) => {
          this.stateChange(gridState);
        })
    );

    this.setupUnclickableColumns();
  }

  private setupUnclickableColumns(){
    this.updateUnclickableColumns(this.defaultGridColumns);
        this.subscriptions.add(this.gridColumns$
          .subscribe(
            (columns) => this.updateUnclickableColumns(columns))
        );
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(DataProcessingActions.updateGridState(gridState));
  }
  override rowIdSelect(event: CellClickEvent) {
    super.rowIdSelect(event, this.router, this.route);
  }
}
