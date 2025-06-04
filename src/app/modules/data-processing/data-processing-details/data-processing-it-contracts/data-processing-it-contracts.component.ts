import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatestWith } from 'rxjs';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import {
  selectDataProcessingAssociatedContracts,
  selectDataProcessingHasModifyPermissions,
  selectDataProcessingIsValid,
  selectDataProcessingMainContract,
} from 'src/app/store/data-processing/selectors';
import {
  selectDprEnableAssociatedContracts,
  selectDprEnableMainContract,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { DropdownComponent } from '../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { StatusChipComponent } from '../../../../shared/components/status-chip/status-chip.component';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { NativeTableComponent } from '../../../../shared/components/native-table/native-table.component';
import { DetailsPageLinkComponent } from '../../../../shared/components/details-page-link/details-page-link.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-states/empty-state.component';

@Component({
  selector: 'app-data-processing-it-contracts',
  templateUrl: './data-processing-it-contracts.component.html',
  styleUrl: './data-processing-it-contracts.component.scss',
  imports: [
    NgIf,
    CardComponent,
    CardHeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    DropdownComponent,
    StatusChipComponent,
    ParagraphComponent,
    StandardVerticalContentGridComponent,
    NativeTableComponent,
    NgFor,
    DetailsPageLinkComponent,
    EmptyStateComponent,
    AsyncPipe,
  ],
})
export class DataProcessingItContractsComponent extends BaseComponent implements OnInit {
  public readonly mainContract$ = this.store.select(selectDataProcessingMainContract);
  public readonly associatedContracts$ = this.store
    .select(selectDataProcessingAssociatedContracts)
    .pipe(filterNullish());
  public readonly anyAssociatedContracts$ = this.associatedContracts$.pipe(matchNonEmptyArray());
  public readonly isDprValid$ = this.store.select(selectDataProcessingIsValid);

  public contractFormGroup = new FormGroup({
    mainContract: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
  });

  public readonly mainContractEnabled$ = this.store.select(selectDprEnableMainContract);
  public readonly associatedContractsEnabled$ = this.store.select(selectDprEnableAssociatedContracts);

  constructor(private store: Store) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.mainContract$
        .pipe(combineLatestWith(this.store.select(selectDataProcessingHasModifyPermissions)))
        .subscribe(([mainContract, hasModifyPermissions]) => {
          this.contractFormGroup.patchValue({ mainContract: mainContract });

          if (hasModifyPermissions) {
            this.contractFormGroup.enable();
          }
        }),
    );
  }

  patchMainContract(contractUuid: string) {
    this.store.dispatch(DataProcessingActions.patchDataProcessing({ general: { mainContractUuid: contractUuid } }));
  }
}
