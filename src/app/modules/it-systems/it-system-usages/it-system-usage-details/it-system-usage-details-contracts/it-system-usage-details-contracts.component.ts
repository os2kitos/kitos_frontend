import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatestWith, filter } from 'rxjs';
import { APIItContractResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectITSystemUsageHasModifyPermission,
  selectItSystemUsageMainContract,
  selectItSystemUsageUuid,
  selectItSystemUsageValidAccordingToMainContract,
} from 'src/app/store/it-system-usage/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypesDictionary } from 'src/app/store/regular-option-type-store/selectors';
import { ItSystemUsageDetailsContractsComponentStore } from './it-system-usage-details-contracts.component-store';
import {
  selectITSystemUsageEnableAssociatedContracts,
  selectITSystemUsageEnableSelectContractToDetermineIfItSystemIsActive,
} from 'src/app/store/organization/ui-module-customization/selectors';

@Component({
  templateUrl: 'it-system-usage-details-contracts.component.html',
  styleUrls: ['it-system-usage-details-contracts.component.scss'],
  providers: [ItSystemUsageDetailsContractsComponentStore],
})
export class ITSystemUsageDetailsContractsComponent extends BaseComponent implements OnInit {
  public readonly mainContract$ = this.store.select(selectItSystemUsageMainContract);
  public readonly mainContractIsValid$ = this.store.select(selectItSystemUsageValidAccordingToMainContract);
  public readonly availableContractsForSelection$ = this.contractsStore.associatedContracts$;
  public availableContractTypesDictionary$ = this.store
    .select(selectRegularOptionTypesDictionary('it-contract_contract-type'))
    .pipe(filterNullish());
  public readonly isLoading$ = this.contractsStore.associatedContractsIsLoading$;
  public readonly contractRows$ = this.contractsStore.contractRows$;
  public readonly anyContracts$ = this.contractRows$.pipe(matchNonEmptyArray());

  public readonly contractSelectionForm = new FormGroup({
    mainContract: new FormControl<APIItContractResponseDTO | undefined>(undefined),
  });

  public readonly associatedContractsEnabled$ = this.store.select(selectITSystemUsageEnableAssociatedContracts);
  public readonly contractToDetermineIsActiveEnabled$ = this.store.select(
    selectITSystemUsageEnableSelectContractToDetermineIfItSystemIsActive
  );

  constructor(
    private readonly store: Store,
    private readonly contractsStore: ItSystemUsageDetailsContractsComponentStore,
    private readonly notificationService: NotificationService
  ) {
    super();
  }

  public patchMainContract(uuid?: string) {
    if (this.contractSelectionForm.valid) {
      this.store.dispatch(ITSystemUsageActions.patchITSystemUsage({ general: { mainContractUuid: uuid } }));
    } else {
      this.notificationService.showError($localize`Valg af kontrakt er ugyldig`);
    }
  }

  public ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract_contract-type'));

    //Update form on changes
    this.subscriptions.add(
      this.mainContract$
        .pipe(filterNullish(), combineLatestWith(this.availableContractsForSelection$))
        .subscribe(([mainContract, availableContracts]) =>
          this.contractSelectionForm.patchValue({
            mainContract: availableContracts.filter((contract) => contract.uuid === mainContract?.uuid).pop(),
          })
        )
    );

    // Initiate load of associated contracts when system usage changes
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageUuid)
        .pipe(filterNullish())
        .subscribe((itSystemUsageUuid) => this.contractsStore.getAssociatedContracts(itSystemUsageUuid))
    );

    // Disable forms if user does not have rights to modify
    this.subscriptions.add(
      this.store
        .select(selectITSystemUsageHasModifyPermission)
        .pipe(filter((hasModifyPermission) => hasModifyPermission === false))
        .subscribe(() => {
          this.contractSelectionForm.disable();
        })
    );
  }
}
