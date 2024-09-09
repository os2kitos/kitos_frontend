import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { combineLatestWith, first } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { getColumnsToShow } from 'src/app/shared/helpers/grid-config-helper';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { yesNoOptions } from 'src/app/shared/models/yes-no.model';
import {
  AGREEMENT_DEADLINES_SECTION_NAME,
  CATALOG_SECTION_NAME,
  CONTRACT_COLUMNS_ID,
  CONTRACT_SECTION_NAME,
  DATA_PROCESSING_SECTION_NAME,
  ECONOMY_SECTION_NAME,
  REFERENCE_SECTION_NAME,
} from 'src/app/shared/persistent-state-constants';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import {
  selectContractGridColumns,
  selectContractGridData,
  selectContractGridLoading,
  selectContractGridRoleColumns,
  selectContractGridState,
  selectItContractHasCollectionCreatePermissions,
  selectItContractLastSeenGridConfig,
} from 'src/app/store/it-contract/selectors';
import { selectGridConfigModificationPermission } from 'src/app/store/user-store/selectors';

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

  public readonly hasConfigModificationPermissions$ = this.store.select(selectGridConfigModificationPermission);
  public readonly lastSeenGridConfig$ = this.store.select(selectItContractLastSeenGridConfig);

  constructor(
    store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private actions$: Actions,
    private statePersistingService: StatePersistingService
  ) {
    super(store, 'it-contract');
  }

  private contractSection = CONTRACT_SECTION_NAME;

  private readonly defaultGridColumns: GridColumn[] = [
    {
      field: 'IsActive',
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
      field: 'ContractId',
      title: $localize`Kontrakt ID`,
      section: this.contractSection,
      hidden: false,
      persistId: 'contractId',
    },
    {
      field: 'ParentContractName',
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
      field: 'Name',
      title: $localize`IT Kontrakt`,
      section: this.contractSection,
      hidden: false,
      required: true,
      persistId: 'contractName',
    },
    {
      field: 'Concluded',
      title: $localize`Gyldig fra`,
      section: this.contractSection,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
      persistId: 'concluded',
    },
    {
      field: 'ExpirationDate',
      title: $localize`Gyldig til`,
      section: this.contractSection,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
      persistId: 'expirationDate',
    },
    {
      field: 'CriticalityUuid',
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
      field: 'ResponsibleOrgUnitName',
      title: $localize`Ansvarlig org. enhed`,
      section: this.contractSection,
      width: 320,
      hidden: false,
      persistId: 'responsibleOrganizationUnitName',
    },
    {
      field: 'SupplierName',
      title: $localize`Leverandør`,
      section: this.contractSection,
      hidden: false,
      persistId: 'supplierName',
    },
    {
      field: 'ContractSigner',
      title: $localize`Kontraktunderskriver`,
      section: this.contractSection,
      width: 320,
      hidden: false,
      persistId: 'contractSigner',
    },
    {
      field: 'ContractTypeUuid',
      dataField: 'ContractTypeName',
      title: $localize`Kontrakttype`,
      section: this.contractSection,
      extraFilter: 'choice-type',
      extraData: 'it-contract_contract-type',
      style: 'uuid-to-name',
      hidden: false,
      persistId: 'ContractTypeUuid', //Doesn't seem to exist in the old UI
    },
    {
      field: 'ContractTemplateUuid',
      dataField: 'ContractTemplateName',
      title: $localize`Kontraktskabelon`,
      section: this.contractSection,
      extraFilter: 'choice-type',
      extraData: 'it-contract_contract-template-type',
      style: 'uuid-to-name',
      hidden: false,
      persistId: 'ContractTemplateUuid', //this aswell
    },
    {
      field: 'PurchaseFormUuid',
      dataField: 'PurchaseFormName',
      title: $localize`Indkøbsform`,
      section: this.contractSection,
      extraFilter: 'choice-type',
      extraData: 'it-contract_purchase-form-type',
      style: 'uuid-to-name',
      hidden: false,
      persistId: 'PurchaseFormUuid', //this aswell
    },
    {
      field: 'ProcurementStrategyUuid',
      dataField: 'ProcurementStrategyName',
      title: $localize`Genanskaffelsesstrategi`,
      section: this.contractSection,
      extraFilter: 'choice-type',
      extraData: 'it-contract_procurement-strategy-type',
      style: 'uuid-to-name',
      width: 320,
      hidden: false,
      persistId: 'ProcurementStrategyUuid', //this aswell
    },
    {
      field: 'ProcurementPlanYear',
      title: $localize`Genanskaffelsesplan`,
      section: this.contractSection,
      extraFilter: 'dropdown-from-column-data',
      width: 300,
      hidden: false,
      persistId: 'procurementPlanYear',
    },
    {
      field: 'ProcurementInitiated',
      title: $localize`Genanskaffelse igangsat`,
      section: this.contractSection,
      extraFilter: 'enum',
      extraData: yesNoOptions,
      width: 330,
      hidden: false,
      persistId: 'procurementInitiated',
    },
    {
      field: 'DataProcessingAgreements',
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
      field: 'ItSystemUsages',
      title: $localize`IT Systemer`,
      style: 'page-link-array',
      dataField: 'ItSystemUsages',
      entityType: 'it-system-usage',
      section: CATALOG_SECTION_NAME,
      hidden: false,
      persistId: 'associatedSystemUsages',
    },
    {
      field: 'SourceEntityUuid',
      title: $localize`IT Systemer (UUID)`,
      section: CATALOG_SECTION_NAME,
      width: 320,
      hidden: false,
      persistId: 'itSystemUuid',
    },
    {
      field: 'NumberOfAssociatedSystemRelations',
      title: $localize`Antal relationer`,
      section: CATALOG_SECTION_NAME,
      filter: 'numeric',
      hidden: false,
      persistId: 'relationCount',
    },
    {
      field: 'ActiveReferenceTitle',
      title: $localize`Reference`,
      section: REFERENCE_SECTION_NAME,
      style: 'title-link',
      idField: 'ActiveReferenceUrl',
      hidden: false,
      persistId: 'referenceTitle',
    },
    {
      field: 'ActiveReferenceExternalReferenceId',
      title: $localize`Dokument ID/Sagsnr.`,
      section: REFERENCE_SECTION_NAME,
      hidden: false,
      persistId: 'referenceExternalReferenceId',
    },
    {
      field: 'AccumulatedAcquisitionCost',
      title: $localize`Anskaffelse.`,
      section: ECONOMY_SECTION_NAME,
      filter: 'numeric',
      hidden: false,
      persistId: 'acquisition',
    },
    {
      field: 'AccumulatedOperationCost',
      title: $localize`Drift/år`,
      section: ECONOMY_SECTION_NAME,
      filter: 'numeric',
      hidden: false,
      persistId: 'operation',
    },
    {
      field: 'AccumulatedOtherCost',
      title: $localize`Andet`,
      section: ECONOMY_SECTION_NAME,
      filter: 'numeric',
      hidden: false,
      persistId: 'other',
    },
    {
      field: 'OperationRemunerationBegunDate',
      title: $localize`Driftsvederlag begyndt`,
      section: ECONOMY_SECTION_NAME,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
      persistId: 'operationRemunerationBegun',
    },
    {
      field: 'PaymentModelUuid',
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
      field: 'PaymentFrequencyUuid',
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
      field: 'LatestAuditDate',
      title: $localize`Audit dato`,
      section: ECONOMY_SECTION_NAME,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
      persistId: 'latestAuditDate',
    },
    {
      field: 'AuditStatusGreen',
      title: $localize`Audit status: grøn`,
      section: ECONOMY_SECTION_NAME,
      noFilter: true,
      hidden: false,
      persistId: 'auditStatusGreen', //These colors also differ from the old UI as they are 4 seperate columns. Need to be handled later
    },
    {
      field: 'AuditStatusRed',
      title: $localize`Audit status: rød`,
      section: ECONOMY_SECTION_NAME,
      noFilter: true,
      hidden: false,
      persistId: 'auditStatusRed',
    },
    {
      field: 'AuditStatusYellow',
      title: $localize`Audit status: gul`,
      section: ECONOMY_SECTION_NAME,
      noFilter: true,
      hidden: false,
      persistId: 'auditStatusYellow',
    },
    {
      field: 'AuditStatusWhite',
      title: $localize`Audit status: hvid`,
      section: ECONOMY_SECTION_NAME,
      noFilter: true,
      hidden: false,
      persistId: 'auditStatusWhite',
    },
    {
      field: 'Duration',
      title: $localize`Varighed`,
      section: AGREEMENT_DEADLINES_SECTION_NAME,
      hidden: false,
      persistId: 'duration',
    },
    {
      field: 'OptionExtendUuid',
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
      field: 'TerminationDeadlineUuid',
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
      field: 'IrrevocableTo',
      title: $localize`Uopsigelig til`,
      section: AGREEMENT_DEADLINES_SECTION_NAME,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
      persistId: 'irrevocableTo',
    },
    {
      field: 'TerminatedAt',
      title: $localize`Opsagt`,
      section: AGREEMENT_DEADLINES_SECTION_NAME,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
      persistId: 'terminated',
    },
    {
      field: 'LastEditedByUserName',
      title: $localize`Sidst redigeret: Bruger`,
      section: this.contractSection,
      filter: 'numeric',
      width: 320,
      hidden: false,
      persistId: 'lastEditedByUser',
    },
    {
      field: 'LastEditedAtDate',
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
    const existingColumns = this.statePersistingService.get<GridColumn[]>(CONTRACT_COLUMNS_ID);

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
