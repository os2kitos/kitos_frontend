import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { combineLatestWith, first } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import * as GridFields from 'src/app/shared/constants/it-contracts-grid-column-constants';
import {
  AGREEMENT_DEADLINES_SECTION_NAME,
  CATALOG_SECTION_NAME,
  CONTRACT_COLUMNS_ID,
  CONTRACT_SECTION_NAME,
  DATA_PROCESSING_SECTION_NAME,
  ECONOMY_SECTION_NAME,
  REFERENCE_SECTION_NAME,
} from 'src/app/shared/constants/persistent-state-constants';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { getColumnsToShow } from 'src/app/shared/helpers/grid-config-helper';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { yesNoOptions } from 'src/app/shared/models/yes-no.model';
import { GridDataKey } from 'src/app/shared/services/column-filter-data.service';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { GridUIConfigService } from 'src/app/shared/services/ui-config-services/grid-ui-config.service';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import {
  selectContractGridColumns,
  selectContractGridData,
  selectContractGridLoading,
  selectContractGridRoleColumns,
  selectContractGridState,
  selectItContractHasCollectionCreatePermissions,
} from 'src/app/store/it-contract/selectors';

@Component({
  templateUrl: 'it-contracts.component.html',
  styleUrls: ['it-contracts.component.scss'],
})
export class ITContractsComponent extends BaseOverviewComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectContractGridLoading);
  public readonly gridData$ = this.store.select(selectContractGridData);
  public readonly gridState$ = this.store.select(selectContractGridState);
  public readonly gridColumns$ = this.store.select(selectContractGridColumns);
  public readonly hasCreatePermission$ = this.store.select(selectItContractHasCollectionCreatePermissions);
  public readonly uiConfigApplications$ = this.configService.getUIConfigApplications(UIModuleConfigKey.ItContract);

  constructor(
    store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private actions$: Actions,
    private gridColumnStorageService: GridColumnStorageService,
    private configService: GridUIConfigService
  ) {
    super(store, 'it-contract');
  }

  private contractSection = CONTRACT_SECTION_NAME;

  private readonly defaultGridColumns: GridColumn[] = [
    {
      field: GridFields.IsActive,
      title: $localize`Gyldig/Ikke Gyldig`,
      section: this.contractSection,
      filter: 'boolean',
      extraData: [
        {
          name: $localize`Gyldig`,
          value: true,
        },
        {
          name: $localize`Ikke gyldig`,
          value: false,
        },
      ],
      style: 'chip',
      entityType: 'it-contract',
      hidden: false,
      persistId: 'isActive',
    },
    {
      field: GridFields.ContractId,
      title: $localize`Kontrakt ID`,
      section: this.contractSection,
      hidden: false,
      persistId: 'contractId',
    },
    {
      field: GridFields.ParentContractName,
      title: $localize`Overordnet kontrakt`,
      section: this.contractSection,
      style: 'page-link',
      idField: 'ParentContractUuid',
      entityType: 'it-contract',
      width: 320,
      hidden: false,
      persistId: 'parentName',
    },
    {
      field: GridFields.Name,
      title: $localize`IT Kontrakt`,
      section: this.contractSection,
      hidden: false,
      required: true,
      persistId: 'contractName',
    },
    {
      field: GridFields.Concluded,
      title: $localize`Gyldig fra`,
      section: this.contractSection,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
      persistId: 'concluded',
    },
    {
      field: GridFields.ExpirationDate,
      title: $localize`Gyldig til`,
      section: this.contractSection,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
      persistId: 'expirationDate',
    },
    {
      field: GridFields.CriticalityUuid,
      dataField: 'CriticalityName',
      title: $localize`Kritikalitet`,
      section: this.contractSection,
      extraFilter: 'choice-type',
      extraData: 'it-contract_criticality-type',
      style: 'uuid-to-name',
      hidden: false,
      persistId: 'criticality',
    },
    {
      field: GridFields.ResponsibleOrgUnitName,
      title: $localize`Ansvarlig org. enhed`,
      section: this.contractSection,
      width: 320,
      hidden: false,
      persistId: 'responsibleOrganizationUnitName',
    },
    {
      field: GridFields.SupplierName,
      title: $localize`Leverandør`,
      section: this.contractSection,
      hidden: false,
      persistId: 'supplierName',
    },
    {
      field: GridFields.ContractSigner,
      title: $localize`Kontraktunderskriver`,
      section: this.contractSection,
      width: 320,
      hidden: false,
      persistId: 'contractSigner',
    },
    {
      field: GridFields.ContractTypeUuid,
      dataField: 'ContractTypeName',
      title: $localize`Kontrakttype`,
      section: this.contractSection,
      extraFilter: 'choice-type',
      extraData: 'it-contract_contract-type',
      style: 'uuid-to-name',
      hidden: false,
      persistId: 'contractType',
    },
    {
      field: GridFields.ContractTemplateUuid,
      dataField: 'ContractTemplateName',
      title: $localize`Kontraktskabelon`,
      section: this.contractSection,
      extraFilter: 'choice-type',
      extraData: 'it-contract_contract-template-type',
      style: 'uuid-to-name',
      hidden: false,
      persistId: 'contractTemplate',
    },
    {
      field: GridFields.PurchaseFormUuid,
      dataField: 'PurchaseFormName',
      title: $localize`Indkøbsform`,
      section: this.contractSection,
      extraFilter: 'choice-type',
      extraData: 'it-contract_purchase-form-type',
      style: 'uuid-to-name',
      hidden: false,
      persistId: 'purchaseForm',
    },
    {
      field: GridFields.ProcurementStrategyUuid,
      dataField: 'ProcurementStrategyName',
      title: $localize`Genanskaffelsesstrategi`,
      section: this.contractSection,
      extraFilter: 'choice-type',
      extraData: 'it-contract_procurement-strategy-type',
      style: 'uuid-to-name',
      width: 320,
      hidden: false,
      persistId: 'procurementStrategy',
    },
    {
      field: GridFields.ProcurementPlanYear,
      title: $localize`Genanskaffelsesplan`,
      section: this.contractSection,
      extraFilter: 'dropdown-from-column-data',
      extraData: GridDataKey.appliedProcurementPlans,
      width: 300,
      hidden: false,
      persistId: 'procurementPlanYear',
    },
    {
      field: GridFields.ProcurementInitiated,
      title: $localize`Genanskaffelse igangsat`,
      section: this.contractSection,
      extraFilter: 'enum',
      extraData: yesNoOptions,
      width: 330,
      hidden: false,
      persistId: 'procurementInitiated',
    },
    {
      field: GridFields.DataProcessingAgreements,
      title: $localize`Databehandleraftaler`,
      style: 'page-link-array',
      dataField: 'DataProcessingAgreements',
      entityType: 'data-processing-registration',
      section: DATA_PROCESSING_SECTION_NAME,
      width: 320,
      hidden: false,
      persistId: 'dataProcessingRegistrations',
    },
    {
      field: GridFields.ItSystemUsages,
      title: $localize`IT Systemer`,
      style: 'page-link-array',
      dataField: 'ItSystemUsages',
      entityType: 'it-system-usage',
      section: CATALOG_SECTION_NAME,
      hidden: false,
      persistId: 'associatedSystemUsages',
    },
    {
      field: GridFields.ItSystemUsageUuidsAsCsv,
      dataField: 'ItSystemUsageUuids',
      title: $localize`IT Systemer (UUID)`,
      section: CATALOG_SECTION_NAME,
      width: 320,
      hidden: false,
      persistId: 'itSystemUuid',
    },
    {
      field: GridFields.NumberOfAssociatedSystemRelations,
      title: $localize`Antal relationer`,
      section: CATALOG_SECTION_NAME,
      filter: 'numeric',
      hidden: false,
      persistId: 'relationCount',
    },
    {
      field: GridFields.ActiveReferenceTitle,
      title: $localize`Reference`,
      section: REFERENCE_SECTION_NAME,
      style: 'title-link',
      idField: 'ActiveReferenceUrl',
      hidden: false,
      persistId: 'referenceTitle',
    },
    {
      field: GridFields.ActiveReferenceExternalReferenceId,
      title: $localize`Dokument ID/Sagsnr.`,
      section: REFERENCE_SECTION_NAME,
      hidden: false,
      persistId: 'referenceExternalReferenceId',
    },
    {
      field: GridFields.AccumulatedAcquisitionCost,
      title: $localize`Anskaffelse.`,
      section: ECONOMY_SECTION_NAME,
      filter: 'numeric',
      hidden: false,
      persistId: 'acquisition',
    },
    {
      field: GridFields.AccumulatedOperationCost,
      title: $localize`Drift/år`,
      section: ECONOMY_SECTION_NAME,
      filter: 'numeric',
      hidden: false,
      persistId: 'operation',
    },
    {
      field: GridFields.AccumulatedOtherCost,
      title: $localize`Andet`,
      section: ECONOMY_SECTION_NAME,
      filter: 'numeric',
      hidden: false,
      persistId: 'other',
    },
    {
      field: GridFields.OperationRemunerationBegunDate,
      title: $localize`Driftsvederlag begyndt`,
      section: ECONOMY_SECTION_NAME,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
      persistId: 'operationRemunerationBegun',
    },
    {
      field: GridFields.PaymentModelUuid,
      dataField: 'PaymentModelName',
      title: $localize`Betalingsmodel`,
      section: ECONOMY_SECTION_NAME,
      extraFilter: 'choice-type',
      extraData: 'it-contract-payment-model-types',
      style: 'uuid-to-name',
      hidden: false,
      persistId: 'paymentModel',
    },
    {
      field: GridFields.PaymentFrequencyUuid,
      dataField: 'PaymentFrequencyName',
      title: $localize`Betalingsfrekvens`,
      section: ECONOMY_SECTION_NAME,
      extraFilter: 'choice-type',
      extraData: 'it-contract-payment-frequency-types',
      style: 'uuid-to-name',
      hidden: false,
      persistId: 'paymentFrequency',
    },
    {
      field: GridFields.LatestAuditDate,
      title: $localize`Audit dato`,
      section: ECONOMY_SECTION_NAME,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
      persistId: 'auditDate',
    },
    {
      field: GridFields.AuditStatusGreen,
      title: $localize`Audit status: grøn`,
      section: ECONOMY_SECTION_NAME,
      noFilter: true,
      hidden: false,
      persistId: 'auditStatus', //These colors also differ from the old UI as they are 4 seperate columns. Need to be handled later
    },
    {
      field: GridFields.AuditStatusRed,
      title: $localize`Audit status: rød`,
      section: ECONOMY_SECTION_NAME,
      noFilter: true,
      hidden: false,
      persistId: 'auditStatusRed',
    },
    {
      field: GridFields.AuditStatusYellow,
      title: $localize`Audit status: gul`,
      section: ECONOMY_SECTION_NAME,
      noFilter: true,
      hidden: false,
      persistId: 'auditStatusYellow',
    },
    {
      field: GridFields.AuditStatusWhite,
      title: $localize`Audit status: hvid`,
      section: ECONOMY_SECTION_NAME,
      noFilter: true,
      hidden: false,
      persistId: 'auditStatusWhite',
    },
    {
      field: GridFields.Duration,
      title: $localize`Varighed`,
      section: AGREEMENT_DEADLINES_SECTION_NAME,
      hidden: false,
      persistId: 'duration',
    },
    {
      field: GridFields.OptionExtendUuid,
      dataField: 'OptionExtendName',
      title: $localize`Option`,
      section: AGREEMENT_DEADLINES_SECTION_NAME,
      extraFilter: 'choice-type',
      extraData: 'it-contract-extend-types',
      style: 'uuid-to-name',
      hidden: false,
      persistId: 'optionExtend',
    },
    {
      field: GridFields.TerminationDeadlineUuid,
      dataField: 'TerminationDeadlineName',
      title: $localize`Opsigelse (måneder)`,
      section: AGREEMENT_DEADLINES_SECTION_NAME,
      extraFilter: 'choice-type',
      extraData: 'it-contract-termination-period-types',
      style: 'uuid-to-name',
      sortFilter: true,
      hidden: false,
      persistId: 'terminationDeadline',
    },
    {
      field: GridFields.IrrevocableTo,
      title: $localize`Uopsigelig til`,
      section: AGREEMENT_DEADLINES_SECTION_NAME,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
      persistId: 'irrevocableTo',
    },
    {
      field: GridFields.TerminatedAt,
      title: $localize`Opsagt`,
      section: AGREEMENT_DEADLINES_SECTION_NAME,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
      persistId: 'terminated',
    },
    {
      field: GridFields.LastEditedByUserName,
      title: $localize`Sidst redigeret: Bruger`,
      section: this.contractSection,
      width: 320,
      hidden: false,
      persistId: 'lastChangedByUser',
    },
    {
      field: GridFields.LastEditedAtDate,
      title: $localize`Sidst redigeret: Dato`,
      section: this.contractSection,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
      persistId: 'lastChangedDate',
    },
  ];

  ngOnInit(): void {
    const existingColumns = this.gridColumnStorageService.getColumns(CONTRACT_COLUMNS_ID, this.defaultGridColumns);

    this.store.dispatch(ITContractActions.getAppliedProcurementPlans());
    this.store.dispatch(ITContractActions.getITContractCollectionPermissions());

    if (existingColumns) {
      this.store.dispatch(ITContractActions.updateGridColumns(existingColumns));
    } else {
      this.store.dispatch(ITContractActions.getItContractOverviewRoles());
      this.subscriptions.add(
        this.actions$
          .pipe(
            ofType(ITContractActions.getItContractOverviewRolesSuccess),
            combineLatestWith(this.store.select(selectContractGridRoleColumns)),
            first()
          )
          .subscribe(([_, gridRoleColumns]) => {
            this.store.dispatch(
              ITContractActions.updateGridColumnsAndRoleColumns(this.defaultGridColumns, gridRoleColumns)
            );
          })
      );
    }

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.createItContractSuccess), combineLatestWith(this.gridState$))
        .subscribe(([_, gridState]) => {
          this.stateChange(gridState);
        })
    );

    this.updateUnclickableColumns(this.defaultGridColumns);
    this.subscriptions.add(this.gridColumns$.subscribe((columns) => this.updateUnclickableColumns(columns)));

    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));

    this.actions$
      .pipe(ofType(ITContractActions.resetToOrganizationITContractColumnConfigurationError))
      .subscribe(() => {
        this.gridColumns$.pipe(first()).subscribe((columns) => {
          const columnsToShow = getColumnsToShow(columns, this.defaultGridColumns);
          this.store.dispatch(ITContractActions.updateGridColumns(columnsToShow));
        });
      });
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITContractActions.updateGridState(gridState));
  }
  override rowIdSelect(event: CellClickEvent) {
    super.rowIdSelect(event, this.router, this.route);
  }
}
