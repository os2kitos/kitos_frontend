import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { combineLatestWith, first, Observable } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import {
  CATALOG_SECTION_NAME,
  CONTRACT_SECTION_NAME,
  DATA_PROCESSING_COLUMNS_ID,
  DATA_PROCESSING_SECTION_NAME,
  REFERENCE_SECTION_NAME,
  SUPERVISION_SECTION_NAME,
} from 'src/app/shared/constants/persistent-state-constants';
import { filterGridColumnsByUIConfig, getColumnsToShow } from 'src/app/shared/helpers/grid-config-helper';
import { isAgreementConcludedOptions } from 'src/app/shared/models/data-processing/is-agreement-concluded.model';
import { isOversightCompletedOptions } from 'src/app/shared/models/data-processing/is-oversight-completed.model';
import { transferToInsecureThirdCountriesOptions } from 'src/app/shared/models/data-processing/transfer-to-insecure-third-countries.model';
import { yearMonthIntervalOptions } from 'src/app/shared/models/data-processing/year-month-interval.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import {
  selectDataProcessingGridColumns,
  selectDataProcessingGridData,
  selectDataProcessingGridLoading,
  selectDataProcessingGridState,
  selectDataProcessingHasCreateCollectionPermissions,
  selectDataProcessingLastSeenGridConfig,
  selectDataProcessingRoleColumns,
} from 'src/app/store/data-processing/selectors';
import { selectGridConfigModificationPermission } from 'src/app/store/user-store/selectors';
import * as GridFields from 'src/app/shared/constants/data-processing-grid-column-constants';
import { UIConfigService } from 'src/app/shared/services/ui-config-services/ui-config.service';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';

@Component({
  selector: 'app-data-processing-overview',
  templateUrl: './data-processing-overview.component.html',
  styleUrl: './data-processing-overview.component.scss',
})
export class DataProcessingOverviewComponent extends BaseOverviewComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectDataProcessingGridLoading);
  public readonly gridData$ = this.store.select(selectDataProcessingGridData);
  public readonly gridState$ = this.store.select(selectDataProcessingGridState);
  public readonly gridColumns$ = this.store
    .select(selectDataProcessingGridColumns)
    .pipe(this.uiConfigService.filterGridColumnsByUIConfig(UIModuleConfigKey.DataProcessingRegistrations));

  public readonly hasConfigModificationPermissions$: Observable<boolean | undefined> = this.store.select(
    selectGridConfigModificationPermission
  );
  public readonly lastSeenGridConfig$ = this.store.select(selectDataProcessingLastSeenGridConfig);

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
      field: GridFields.Name,
      title: $localize`Databehandling`,
      section: DATA_PROCESSING_SECTION_NAME,
      required: true,
      style: 'primary',
      hidden: false,
      persistId: 'dpaName',
    },
    {
      field: GridFields.ActiveAccordingToMainContract,
      title: $localize`Status (Markeret kontrakt)`,
      section: DATA_PROCESSING_SECTION_NAME,
      filter: 'boolean',
      extraData: this.activeOptions,
      entityType: 'data-processing-registration',
      style: 'chip',
      width: 340,
      hidden: true,
      persistId: 'mainContract',
    },
    {
      field: GridFields.MainReferenceTitle,
      title: $localize`Reference`,
      style: 'title-link',
      idField: 'MainReferenceUrl',
      section: REFERENCE_SECTION_NAME,
      hidden: true,
      persistId: 'dpReferenceId',
    },
    {
      field: GridFields.SystemNamesAsCsv,
      title: $localize`IT Systemer`,
      section: CATALOG_SECTION_NAME,
      hidden: false,
      persistId: 'dpSystemNamesAsCsv',
    },
    {
      field: GridFields.MainReferenceUserAssignedId,
      title: $localize`Dokument ID / Sagsnr.`,
      section: REFERENCE_SECTION_NAME,
      width: 320,
      hidden: true,
      persistId: 'dpReferenceUserAssignedId',
    },
    {
      field: GridFields.IsActive,
      title: $localize`Databehandling status`,
      section: DATA_PROCESSING_SECTION_NAME,
      filter: 'boolean',
      extraData: this.activeOptions,
      entityType: 'data-processing-registration',
      style: 'chip',
      width: 320,
      hidden: true,
      persistId: 'dpIsActive', //Does not seem to be in the old UI
    },
    {
      field: GridFields.LastChangedById,
      title: $localize`Sidst ændret ID`,
      section: DATA_PROCESSING_SECTION_NAME,
      filter: 'numeric',
      hidden: true,
      persistId: 'dpLastChangedById', //This aswell
    },
    {
      field: GridFields.LastChangedAt,
      title: $localize`Sidst ændret dato`,
      section: DATA_PROCESSING_SECTION_NAME,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: true,
      persistId: 'changed',
    },
    {
      field: GridFields.ContractNamesAsCsv,
      title: $localize`IT Kontrakter`,
      section: CONTRACT_SECTION_NAME,
      hidden: false,
      persistId: 'dpContractNamesAsCsv',
    },
    {
      field: GridFields.DataProcessorNamesAsCsv,
      title: $localize`Databehandlere`,
      section: DATA_PROCESSING_SECTION_NAME,
      hidden: false,
      persistId: 'dpDataProcessorNamesAsCsv',
    },
    {
      field: GridFields.SystemUuidsAsCsv,
      title: $localize`IT Systemer (UUID)`,
      section: CATALOG_SECTION_NAME,
      width: 300,
      hidden: true,
      persistId: 'itSystemUuid',
    },
    {
      field: GridFields.SubDataProcessorNamesAsCsv,
      title: $localize`Underdatabehandlere`,
      width: 300,
      section: DATA_PROCESSING_SECTION_NAME,
      hidden: true,
      persistId: 'dpSubDataProcessorNamesAsCsv',
    },
    {
      field: GridFields.TransferToInsecureThirdCountries,
      title: $localize`Overførsel til usikkert 3. land`,
      section: DATA_PROCESSING_SECTION_NAME,
      hidden: true,
      style: 'enum',
      extraData: transferToInsecureThirdCountriesOptions,
      extraFilter: 'enum',
      width: 350,
      persistId: 'dpTransferToInsecureThirdCountries',
    },
    {
      field: GridFields.BasisForTransferUuid,
      dataField: 'BasisForTransfer',
      title: $localize`Overførselsgrundlag`,
      section: DATA_PROCESSING_SECTION_NAME,
      extraFilter: 'choice-type',
      extraData: 'data-processing-basis-for-transfer-types',
      hidden: true,
      style: 'uuid-to-name',
      persistId: 'dpBasisForTransfer',
    },
    {
      field: GridFields.DataResponsibleUuid,
      dataField: 'DataResponsible',
      title: $localize`Dataansvarlig`,
      section: DATA_PROCESSING_SECTION_NAME,
      extraFilter: 'choice-type',
      extraData: 'data-processing-data-responsible-types',
      hidden: true,
      style: 'uuid-to-name',
      persistId: 'dpDataResponsible',
    },
    {
      field: GridFields.IsAgreementConcluded,
      title: $localize`Databehandleraftale er indgået`,
      section: DATA_PROCESSING_SECTION_NAME,
      style: 'enum',
      extraFilter: 'enum',
      extraData: isAgreementConcludedOptions,
      hidden: true,
      persistId: 'agreementConcluded',
    },
    {
      field: GridFields.AgreementConcludedAt,
      title: $localize`Dato for indgåelse af databehandleraftale`,
      section: DATA_PROCESSING_SECTION_NAME,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: true,
      persistId: 'agreementConcludedAt',
    },
    {
      field: GridFields.OversightInterval,
      title: $localize`Tilsynsinterval`,
      section: SUPERVISION_SECTION_NAME,
      hidden: true,
      extraFilter: 'enum',
      style: 'enum',
      extraData: yearMonthIntervalOptions,
      persistId: 'oversightInterval',
    },
    {
      field: GridFields.OversightOptionNamesAsCsv,
      title: $localize`Tilsynsmuligheder`,
      section: SUPERVISION_SECTION_NAME,
      hidden: true,
      extraFilter: 'choice-type-by-name',
      extraData: 'data-processing-oversight-option-types',
      persistId: 'dpOversightOptionNamesAsCsv',
    },
    {
      field: GridFields.IsOversightCompleted,
      title: $localize`Gennemført tilsyn`,
      section: SUPERVISION_SECTION_NAME,
      hidden: true,
      extraFilter: 'enum',
      style: 'enum',
      extraData: isOversightCompletedOptions,
      persistId: 'isOversightCompleted',
    },
    {
      field: GridFields.OversightScheduledInspectionDate,
      title: $localize`Kommende planlagt tilsyn`,
      section: SUPERVISION_SECTION_NAME,
      hidden: true,
      filter: 'date',
      style: 'date',
      width: 350,
      persistId: 'scheduledInspectionDate',
    },
    {
      field: GridFields.LatestOversightDate,
      title: $localize`Seneste tilsyn`,
      section: SUPERVISION_SECTION_NAME,
      hidden: true,
      filter: 'date',
      style: 'date',
      width: 350,
      persistId: 'latestOversightDate',
    },
    {
      field: GridFields.LastChangedByName,
      title: $localize`Sidst ændret bruger`,
      section: DATA_PROCESSING_SECTION_NAME,
      width: 300,
      hidden: true,
      persistId: 'lastchangedname',
    },
  ];

  constructor(
    store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private actions$: Actions,
    private statePersistingService: StatePersistingService,
    private uiConfigService: UIConfigService
  ) {
    super(store, 'data-processing-registration');
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

    this.actions$
      .pipe(ofType(DataProcessingActions.resetToOrganizationDataProcessingColumnConfigurationError))
      .subscribe(() => {
        this.gridColumns$.pipe(first()).subscribe((columns) => {
          const columnsToShow = getColumnsToShow(columns, this.defaultGridColumns);
          this.store.dispatch(DataProcessingActions.updateGridColumns(columnsToShow));
        });
      });
  }

  private setupUnclickableColumns() {
    this.updateUnclickableColumns(this.defaultGridColumns);
    this.subscriptions.add(this.gridColumns$.subscribe((columns) => this.updateUnclickableColumns(columns)));
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(DataProcessingActions.updateGridState(gridState));
  }
  override rowIdSelect(event: CellClickEvent) {
    super.rowIdSelect(event, this.router, this.route);
  }
}
