import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import {
  CONTRACT_SUPPLIERS_COLUMNS_ID,
  CONTRACT_SUPPLIERS_SECTION_NAME,
} from 'src/app/shared/constants/persistent-state-constants';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { itContractSupplierTypeOptions } from 'src/app/shared/models/it-contract/it-contract-supplier-type';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { ITContractSupplierActions } from 'src/app/store/it-contract/it-contract-supplier/actions';
import {
  selectSupplierGridColumns,
  selectSupplierGridData,
  selectSupplierGridState,
  selectSupplierIsLoading,
} from 'src/app/store/it-contract/it-contract-supplier/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { ExportMenuButtonComponent } from '../../../shared/components/buttons/export-menu-button/export-menu-button.component';
import { GridOptionsButtonComponent } from '../../../shared/components/grid-options-button/grid-options-button.component';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { HideShowButtonComponent } from '../../../shared/components/grid/hide-show-button/hide-show-button.component';
import { OverviewHeaderComponent } from '../../../shared/components/overview-header/overview-header.component';

@Component({
  templateUrl: './it-contract-supplier.component.html',
  styleUrl: './it-contract-supplier.component.scss',
  selector: 'app-it-contract-supplier',
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
export class ItContractSupplierComponent extends BaseOverviewComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectSupplierIsLoading);
  public readonly gridData$ = this.store.select(selectSupplierGridData);

  public readonly gridState$ = this.store.select(selectSupplierGridState);
  public readonly gridColumns$ = this.store.select(selectSupplierGridColumns);

  private readonly supplierSectionName = CONTRACT_SUPPLIERS_SECTION_NAME;

  public readonly defaultGridColumns: GridColumn[] = [
    {
      field: 'SupplierType',
      title: $localize`Intern/Ekstern`,
      section: this.supplierSectionName,
      hidden: false,
      extraFilter: 'enum',
      style: 'enum',
      extraData: itContractSupplierTypeOptions,
      persistId: 'supplierType',
    },
    {
      field: 'SupplierName',
      title: $localize`Leverandørnavn`,
      style: 'primary',
      section: this.supplierSectionName,
      hidden: false,
      persistId: 'supplierName',
    },
    {
      field: 'SupplierCvr',
      title: $localize`CVR`,
      section: this.supplierSectionName,
      hidden: false,
      persistId: 'supplierCvr',
    },
    {
      field: 'HighestCriticalityUuid',
      dataField: 'HighestCriticalityName',
      title: $localize`Beregnet kritikalitet`,
      style: 'uuid-to-name',
      section: this.supplierSectionName,
      extraFilter: 'choice-type',
      hidden: false,
      persistId: 'criticality',
      extraData: 'it-contract_criticality-type',
    },
    {
      field: 'ContractsAtHighestCriticality',
      title: $localize`Kontrakter med kritikalitet`,
      style: 'page-link-array',
      dataField: 'ContractsAtHighestCriticality',
      entityType: 'it-contract',
      section: this.supplierSectionName,
      hidden: false,
      width: 320,
      persistId: 'contractsAtHighestCriticality',
    },
  ];

  constructor(
    store: Store,
    private gridColumnStorageService: GridColumnStorageService,
    private actions$: Actions,
  ) {
    super(store, 'it-contract-supplier');
  }

  ngOnInit(): void {
    const existingColumns = this.gridColumnStorageService.getColumns(
      CONTRACT_SUPPLIERS_COLUMNS_ID,
      this.defaultGridColumns,
    );
    this.store.dispatch(
      ITContractSupplierActions.updateGridColumns(existingColumns ?? this.defaultGridColumns),
    );

    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract_criticality-type'));

    this.subscriptions.add(
      this.gridState$.pipe(first()).subscribe((state) => {
        this.stateChange(state);
      }),
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractSupplierActions.resetGridConfiguration))
        .subscribe(() => this.useDefaultColumns()),
    );
  }

  private useDefaultColumns(): void {
    this.store.dispatch(ITContractSupplierActions.updateGridColumns(this.defaultGridColumns));
  }

  public stateChange(newState: GridState): void {
    this.store.dispatch(ITContractSupplierActions.updateGridState(newState));
  }
}
