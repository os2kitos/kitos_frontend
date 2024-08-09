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
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';

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
      style: 'chip',
      entityType: 'it-contract',
      hidden: false,
    },
    { field: 'ContractId', title: $localize`Kontrakt ID`, section: 'IT Kontrakter', hidden: false },
    { field: 'ParentContractName', title: $localize`Overordnet kontrakt`, section: 'IT Kontrakter', hidden: false },
    { field: 'Name', title: $localize`IT Kontrakt`, section: 'IT Kontrakter', hidden: false },
    {
      field: 'Concluded',
      title: $localize`Gyldig fra`,
      section: 'IT Kontrakter',
      filter: 'date',
      style: 'date',
      hidden: false,
    },
    {
      field: 'ExpirationDate',
      title: $localize`Gyldig til`,
      section: 'IT Kontrakter',
      filter: 'date',
      style: 'date',
      hidden: false,
    },
    {
      field: 'CriticalityName',
      title: $localize`Kritikalitet`,
      section: 'IT Kontrakter',
      extraFilter: 'choice-type',
      extraData: 'it-contract_criticality-type',
      hidden: false,
    },
    {
      field: 'ResponsibleOrgUnitName',
      title: $localize`Ansvarlig org. enhed`,
      section: 'IT Kontrakter',
      hidden: false,
    },
    { field: 'SupplierName', title: $localize`Leverandør`, section: 'IT Kontrakter', hidden: false },
    { field: 'ContractSigner', title: $localize`Kontraktunderskriver`, section: 'IT Kontrakter', hidden: false },
    {
      field: 'ContractTypeName',
      title: $localize`Kontrakttype`,
      section: 'IT Kontrakter',
      extraFilter: 'choice-type',
      extraData: 'it-contract_contract-type',
      hidden: false,
    },
    {
      field: 'ContractTemplateName',
      title: $localize`Kontraktskabelon`,
      section: 'IT Kontrakter',
      extraFilter: 'choice-type',
      extraData: 'it-contract_contract-template-type',
      hidden: false,
    },
    {
      field: 'PurchaseFormName',
      title: $localize`Indkøbsform`,
      section: 'IT Kontrakter',
      extraFilter: 'choice-type',
      extraData: 'it-contract_purchase-form-type',
      hidden: false,
    },
    {
      field: 'ProcurementStrategyName',
      title: $localize`Genanskaffelsesstrategi`,
      section: 'IT Kontrakter',
      extraFilter: 'choice-type',
      extraData: 'it-contract_procurement-strategy-type',
      hidden: false,
    },
    {
      field: 'ProcurementPlan',
      title: $localize`Genanskaffelsesplan`,
      section: 'IT Kontrakter',
      //TODO: should filter by available dates
      noFilter: true,
      hidden: false,
    },
    {
      field: 'ProcurementInitiated',
      title: $localize`Genanskaffelse igangsat`,
      section: 'IT Kontrakter',
      extraFilter: 'enum',
      extraData: yesNoOptions,
      hidden: false,
    },
    {
      field: 'DataProcessingAgreements',
      title: $localize`Databehandleraftaler`,
      style: 'page-link-array',
      entityType: 'data-processing-registration',
      section: 'IT Kontrakter',
      hidden: false,
    },
    {
      field: 'ItSystemUsages',
      title: $localize`IT Systemer`,
      style: 'page-link-array',
      entityType: 'it-system-usage',
      section: 'IT Kontrakter',
      hidden: false,
    },
    { field: 'SourceEntityUuid', title: $localize`IT Systemer (UUID)`, section: 'IT Kontrakter', hidden: false },
    {
      field: 'NumberOfAssociatedSystemRelations',
      title: $localize`Antal relationer`,
      section: 'IT Kontrakter',
      filter: 'numeric',
      hidden: false,
    },
    {
      field: 'lastChangedById',
      title: $localize`Sidst ændret ID`,
      section: 'IT Kontrakter',
      filter: 'numeric',
      hidden: false,
    },
    { field: 'lastChangedAt', title: $localize`Sidst ændret`, section: 'IT Kontrakter', filter: 'date', hidden: false },
  ];

  ngOnInit(): void {
    RegularOptionTypeActions.getOptions('it-contract_procurement-strategy-type');
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
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(ITContractActions.updateGridState(gridState));
  }

  public rowIdSelect(rowId: string) {
    this.router.navigate([rowId], { relativeTo: this.route });
  }
}
