import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { combineLatestWith, first } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { yesNoOptions } from 'src/app/shared/models/yes-no.model';
import { CONTRACT_COLUMNS_ID, CONTRACT_SECTION_NAME } from 'src/app/shared/persistent-state-constants';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
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

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private actions$: Actions,
    private statePersistingService: StatePersistingService
  ) {
    super();
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
    },
    { field: 'ContractId', title: $localize`Kontrakt ID`, section: this.contractSection, hidden: false },
    {
      field: 'ParentContractName',
      title: $localize`Overordnet kontrakt`,
      section: this.contractSection,
      style: 'page-link',
      idField: 'ParentContractUuid',
      entityType: 'it-contract',
      width: 320,
      hidden: false,
    },
    { field: 'Name', title: $localize`IT Kontrakt`, section: this.contractSection, hidden: false, required: true },
    {
      field: 'Concluded',
      title: $localize`Gyldig fra`,
      section: this.contractSection,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
    },
    {
      field: 'ExpirationDate',
      title: $localize`Gyldig til`,
      section: this.contractSection,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
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
    },
    {
      field: 'ResponsibleOrgUnitName',
      title: $localize`Ansvarlig org. enhed`,
      section: this.contractSection,
      width: 320,
      hidden: false,
    },
    { field: 'SupplierName', title: $localize`Leverandør`, section: this.contractSection, hidden: false },
    {
      field: 'ContractSigner',
      title: $localize`Kontraktunderskriver`,
      section: this.contractSection,
      width: 320,
      hidden: false,
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
    },
    {
      field: 'ProcurementPlanYear',
      title: $localize`Genanskaffelsesplan`,
      section: this.contractSection,
      extraFilter: 'dropdown-from-column-data',
      width: 300,
      hidden: false,
    },
    {
      field: 'ProcurementInitiated',
      title: $localize`Genanskaffelse igangsat`,
      section: this.contractSection,
      extraFilter: 'enum',
      extraData: yesNoOptions,
      width: 330,
      hidden: false,
    },
    {
      field: 'DataProcessingAgreements',
      title: $localize`Databehandleraftaler`,
      style: 'page-link-array',
      dataField: 'DataProcessingAgreements',
      entityType: 'data-processing-registration',
      section: this.contractSection,
      width: 320,
      hidden: false,
    },
    {
      field: 'ItSystemUsages',
      title: $localize`IT Systemer`,
      style: 'page-link-array',
      dataField: 'ItSystemUsages',
      entityType: 'it-system-usage',
      section: this.contractSection,
      hidden: false,
    },
    {
      field: 'SourceEntityUuid',
      title: $localize`IT Systemer (UUID)`,
      section: this.contractSection,
      width: 320,
      hidden: false,
    },
    {
      field: 'NumberOfAssociatedSystemRelations',
      title: $localize`Antal relationer`,
      section: this.contractSection,
      filter: 'numeric',
      hidden: false,
    },
    {
      field: 'ActiveReferenceTitle',
      title: $localize`Reference`,
      section: this.contractSection,
      style: 'title-link',
      idField: 'ActiveReferenceUrl',
      hidden: false,
    },
    {
      field: 'ActiveReferenceExternalReferenceId',
      title: $localize`Dokument ID/Sagsnr.`,
      section: this.contractSection,
      hidden: false,
    },
    {
      field: 'AccumulatedAcquisitionCost',
      title: $localize`Anskaffelse.`,
      section: this.contractSection,
      filter: 'numeric',
      hidden: false,
    },
    {
      field: 'AccumulatedOperationCost',
      title: $localize`Drift/år`,
      section: this.contractSection,
      filter: 'numeric',
      hidden: false,
    },
    {
      field: 'AccumulatedOtherCost',
      title: $localize`Andet`,
      section: this.contractSection,
      filter: 'numeric',
      hidden: false,
    },
    {
      field: 'OperationRemunerationBegunDate',
      title: $localize`Driftsvederlag begyndt`,
      section: this.contractSection,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
    },
    {
      field: 'PaymentModelUuid',
      dataField: 'PaymentModelName',
      title: $localize`Betalingsmodel`,
      section: this.contractSection,
      extraFilter: 'choice-type',
      extraData: 'it-contract-payment-model-types',
      style: 'uuid-to-name',
      hidden: false,
    },
    {
      field: 'PaymentFrequencyUuid',
      dataField: 'PaymentFrequencyName',
      title: $localize`Betalingsfrekvens`,
      section: this.contractSection,
      extraFilter: 'choice-type',
      extraData: 'it-contract-payment-frequency-types',
      style: 'uuid-to-name',
      hidden: false,
    },
    {
      field: 'LatestAuditDate',
      title: $localize`Audit dato`,
      section: this.contractSection,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
    },
    {
      field: 'AuditStatusGreen',
      title: $localize`Audit status: grøn`,
      section: this.contractSection,
      noFilter: true,
      hidden: false,
    },
    {
      field: 'AuditStatusRed',
      title: $localize`Audit status: rød`,
      section: this.contractSection,
      noFilter: true,
      hidden: false,
    },
    {
      field: 'AuditStatusYellow',
      title: $localize`Audit status: gul`,
      section: this.contractSection,
      noFilter: true,
      hidden: false,
    },
    {
      field: 'AuditStatusWhite',
      title: $localize`Audit status: hvid`,
      section: this.contractSection,
      noFilter: true,
      hidden: false,
    },
    {
      field: 'Duration',
      title: $localize`Varighed`,
      section: this.contractSection,
      hidden: false,
    },
    {
      field: 'OptionExtendUuid',
      dataField: 'OptionExtendName',
      title: $localize`Option`,
      section: this.contractSection,
      extraFilter: 'choice-type',
      extraData: 'it-contract-extend-types',
      style: 'uuid-to-name',
      hidden: false,
    },
    {
      field: 'TerminationDeadlineUuid',
      dataField: 'TerminationDeadlineName',
      title: $localize`Opsigelse (måneder)`,
      section: this.contractSection,
      extraFilter: 'choice-type',
      extraData: 'it-contract-termination-period-types',
      style: 'uuid-to-name',
      sortFilter: true,
      hidden: false,
    },
    {
      field: 'IrrevocableTo',
      title: $localize`Uopsigelig til`,
      section: this.contractSection,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
    },
    {
      field: 'TerminatedAt',
      title: $localize`Opsagt`,
      section: this.contractSection,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
    },
    {
      field: 'LastEditedByUserName',
      title: $localize`Sidst redigeret: Bruger`,
      section: this.contractSection,
      filter: 'numeric',
      width: 320,
      hidden: false,
    },
    {
      field: 'LastEditedAtDate',
      title: $localize`Sidst redigeret: Dato`,
      section: this.contractSection,
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
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
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITContractActions.updateGridState(gridState));
  }
  override rowIdSelect(event: CellClickEvent) {
    super.rowIdSelect(event, this.router, this.route);
  }
}
