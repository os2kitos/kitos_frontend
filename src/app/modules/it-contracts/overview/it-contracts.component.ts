import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { yesNoOptions } from 'src/app/shared/models/yes-no.model';
import { CONTRACT_COLUMNS_ID } from 'src/app/shared/persistent-state-constants';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import {
  selectContractGridColumns,
  selectContractGridData,
  selectContractGridLoading,
  selectContractGridState,
  selectItContractHasCollectionCreatePermissions,
} from 'src/app/store/it-contract/selectors';

@Component({
  templateUrl: 'it-contracts.component.html',
  styleUrls: ['it-contracts.component.scss'],
})
export class ITContractsComponent extends BaseComponent implements OnInit {
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

  private readonly gridColumns: GridColumn[] = [
    {
      field: 'IsActive',
      title: $localize`Gyldig/Ikke Gyldig`,
      section: 'IT Kontrakter',
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
    { field: 'ContractId', title: $localize`Kontrakt ID`, section: 'IT Kontrakter', hidden: false },
    {
      field: 'ParentContractName',
      title: $localize`Overordnet kontrakt`,
      section: 'IT Kontrakter',
      style: 'page-link',
      idField: 'ParentContractUuid',
      entityType: 'it-contract',
      width: 320,
      hidden: false,
    },
    { field: 'Name', title: $localize`IT Kontrakt`, section: 'IT Kontrakter', hidden: false },
    {
      field: 'Concluded',
      title: $localize`Gyldig fra`,
      section: 'IT Kontrakter',
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
    },
    {
      field: 'ExpirationDate',
      title: $localize`Gyldig til`,
      section: 'IT Kontrakter',
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
    },
    {
      field: 'CriticalityUuid',
      dataField: 'CriticalityName',
      title: $localize`Kritikalitet`,
      section: 'IT Kontrakter',
      extraFilter: 'choice-type',
      extraData: 'it-contract_criticality-type',
      style: 'uuid-to-name',
      hidden: false,
    },
    {
      field: 'ResponsibleOrgUnitName',
      title: $localize`Ansvarlig org. enhed`,
      section: 'IT Kontrakter',
      width: 320,
      hidden: false,
    },
    { field: 'SupplierName', title: $localize`Leverandør`, section: 'IT Kontrakter', hidden: false },
    {
      field: 'ContractSigner',
      title: $localize`Kontraktunderskriver`,
      section: 'IT Kontrakter',
      width: 320,
      hidden: false,
    },
    {
      field: 'ContractTypeUuid',
      dataField: 'ContractTypeName',
      title: $localize`Kontrakttype`,
      section: 'IT Kontrakter',
      extraFilter: 'choice-type',
      extraData: 'it-contract_contract-type',
      style: 'uuid-to-name',
      hidden: false,
    },
    {
      field: 'ContractTemplateUuid',
      dataField: 'ContractTemplateName',
      title: $localize`Kontraktskabelon`,
      section: 'IT Kontrakter',
      extraFilter: 'choice-type',
      extraData: 'it-contract_contract-template-type',
      style: 'uuid-to-name',
      hidden: false,
    },
    {
      field: 'PurchaseFormUuid',
      dataField: 'PurchaseFormName',
      title: $localize`Indkøbsform`,
      section: 'IT Kontrakter',
      extraFilter: 'choice-type',
      extraData: 'it-contract_purchase-form-type',
      style: 'uuid-to-name',
      hidden: false,
    },
    {
      field: 'ProcurementStrategyUuid',
      dataField: 'ProcurementStrategyName',
      title: $localize`Genanskaffelsesstrategi`,
      section: 'IT Kontrakter',
      extraFilter: 'choice-type',
      extraData: 'it-contract_procurement-strategy-type',
      style: 'uuid-to-name',
      width: 320,
      hidden: false,
    },
    {
      field: 'ProcurementPlanYear',
      title: $localize`Genanskaffelsesplan`,
      section: 'IT Kontrakter',
      extraFilter: 'dropdown-from-column-data',
      width: 300,
      hidden: false,
    },
    {
      field: 'ProcurementInitiated',
      title: $localize`Genanskaffelse igangsat`,
      section: 'IT Kontrakter',
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
      section: 'IT Kontrakter',
      width: 320,
      hidden: false,
    },
    {
      field: 'ItSystemUsages',
      title: $localize`IT Systemer`,
      style: 'page-link-array',
      dataField: 'ItSystemUsages',
      entityType: 'it-system-usage',
      section: 'IT Kontrakter',
      hidden: false,
    },
    {
      field: 'SourceEntityUuid',
      title: $localize`IT Systemer (UUID)`,
      section: 'IT Kontrakter',
      width: 320,
      hidden: false,
    },
    {
      field: 'NumberOfAssociatedSystemRelations',
      title: $localize`Antal relationer`,
      section: 'IT Kontrakter',
      filter: 'numeric',
      hidden: false,
    },
    {
      field: 'ActiveReferenceTitle',
      title: $localize`Reference`,
      section: 'IT Kontrakter',
      style: 'title-link',
      idField: 'ActiveReferenceUrl',
      hidden: false,
    },
    {
      field: 'ActiveReferenceExternalReferenceId',
      title: $localize`Dokument ID/Sagsnr.`,
      section: 'IT Kontrakter',
      hidden: false,
    },
    {
      field: 'AccumulatedAcquisitionCost',
      title: $localize`Anskaffelse.`,
      section: 'IT Kontrakter',
      filter: 'numeric',
      hidden: false,
    },
    {
      field: 'AccumulatedOperationCost',
      title: $localize`Drift/år`,
      section: 'IT Kontrakter',
      filter: 'numeric',
      hidden: false,
    },
    {
      field: 'AccumulatedOtherCost',
      title: $localize`Andet`,
      section: 'IT Kontrakter',
      filter: 'numeric',
      hidden: false,
    },
    {
      field: 'OperationRemunerationBegunDate',
      title: $localize`Driftsvederlag begyndt`,
      section: 'IT Kontrakter',
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
    },
    {
      field: 'PaymentModelUuid',
      dataField: 'PaymentModelName',
      title: $localize`Betalingsmodel`,
      section: 'IT Kontrakter',
      extraFilter: 'choice-type',
      extraData: 'it-contract-payment-model-types',
      style: 'uuid-to-name',
      hidden: false,
    },
    {
      field: 'PaymentFrequencyUuid',
      dataField: 'PaymentFrequencyName',
      title: $localize`Betalingsfrekvens`,
      section: 'IT Kontrakter',
      extraFilter: 'choice-type',
      extraData: 'it-contract-payment-frequency-types',
      style: 'uuid-to-name',
      hidden: false,
    },
    {
      field: 'LatestAuditDate',
      title: $localize`Audit dato`,
      section: 'IT Kontrakter',
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
    },
    {
      field: 'AuditStatusGreen',
      title: $localize`Audit status: grøn`,
      section: 'IT Kontrakter',
      noFilter: true,
      hidden: false,
    },
    {
      field: 'AuditStatusRed',
      title: $localize`Audit status: rød`,
      section: 'IT Kontrakter',
      noFilter: true,
      hidden: false,
    },
    {
      field: 'AuditStatusYellow',
      title: $localize`Audit status: gul`,
      section: 'IT Kontrakter',
      noFilter: true,
      hidden: false,
    },
    {
      field: 'AuditStatusWhite',
      title: $localize`Audit status: hvid`,
      section: 'IT Kontrakter',
      noFilter: true,
      hidden: false,
    },
    {
      field: 'Duration',
      title: $localize`Varighed`,
      section: 'IT Kontrakter',
      hidden: false,
    },
    {
      field: 'OptionExtendUuid',
      dataField: 'OptionExtendName',
      title: $localize`Option`,
      section: 'IT Kontrakter',
      extraFilter: 'choice-type',
      extraData: 'it-contract-extend-types',
      style: 'uuid-to-name',
      hidden: false,
    },
    {
      field: 'TerminationDeadlineUuid',
      dataField: 'TerminationDeadlineName',
      title: $localize`Opsigelse (måneder)`,
      section: 'IT Kontrakter',
      extraFilter: 'choice-type',
      extraData: 'it-contract-termination-period-types',
      style: 'uuid-to-name',
      sortFilter: true,
      hidden: false,
    },
    {
      field: 'IrrevocableTo',
      title: $localize`Uopsigelig til`,
      section: 'IT Kontrakter',
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
    },
    {
      field: 'TerminatedAt',
      title: $localize`Opsagt`,
      section: 'IT Kontrakter',
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
    },
    {
      field: 'LastEditedByUserName',
      title: $localize`Sidst redigeret: Bruger`,
      section: 'IT Kontrakter',
      filter: 'numeric',
      width: 320,
      hidden: false,
    },
    {
      field: 'LastEditedAtDate',
      title: $localize`Sidst redigeret: Dato`,
      section: 'IT Kontrakter',
      filter: 'date',
      style: 'date',
      width: 350,
      hidden: false,
    },
  ];

  ngOnInit(): void {
    const existingColumns = this.statePersistingService.get<GridColumn[]>(CONTRACT_COLUMNS_ID);
    this.store.dispatch(ITContractActions.getItContractOverviewRoles());
    if (existingColumns) {
      this.store.dispatch(ITContractActions.updateGridColumns(existingColumns));
    } else {
      this.subscriptions.add(
        this.actions$
          .pipe(
            ofType(ITContractActions.getItContractOverviewRolesSuccess),
            combineLatestWith(this.store.select(selectContractGridColumns)),
            first()
          )
          .subscribe(([_, gridRoleColumns]) => {
            this.store.dispatch(ITContractActions.updateGridColumnsAndRoleColumns(this.gridColumns, gridRoleColumns));
          })
      );
    }
    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.createItContractSuccess), combineLatestWith(this.gridState$))
        .subscribe(([_, gridState]) => {
          this.stateChange(gridState);
        })
    );

    this.store.dispatch(ITContractActions.getITContractCollectionPermissions());
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITContractActions.updateGridState(gridState));
  }

  public rowIdSelect(rowId: string) {
    this.router.navigate([rowId], { relativeTo: this.route });
  }
}
