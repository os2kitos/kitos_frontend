import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
import { selectDataProcessingUIModuleConfigEnabledFieldMainContract } from 'src/app/store/organization/ui-module-customization/selectors';

@Component({
  selector: 'app-data-processing-it-contracts',
  templateUrl: './data-processing-it-contracts.component.html',
  styleUrl: './data-processing-it-contracts.component.scss',
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

  public readonly mainContractEnabled$ = this.store.select(selectDataProcessingUIModuleConfigEnabledFieldMainContract);

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
        })
    );
  }

  patchMainContract(contractUuid: string) {
    this.store.dispatch(DataProcessingActions.patchDataProcessing({ general: { mainContractUuid: contractUuid } }));
  }
}
