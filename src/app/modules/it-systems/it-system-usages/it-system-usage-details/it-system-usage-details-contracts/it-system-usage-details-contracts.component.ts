import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatestWith, filter, map } from 'rxjs';
import { APIItContractResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ContractTypeActions } from 'src/app/store/contract-type/actions';
import { selectContractTypesDictionary } from 'src/app/store/contract-type/selectors';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectITSystemUsageHasModifyPermission,
  selectItSystemUsageMainContract,
  selectItSystemUsageUuid,
  selectItSystemUsageValidAccordingToMainContract,
} from 'src/app/store/it-system-usage/selectors';
import { ItSystemUsageDetailsContractsComponentStore } from './it-system-usage-details-contracts.component-store';

interface AssociatedContractViewModel extends APIItContractResponseDTO {
  hasOperation: boolean;
}

@Component({
  templateUrl: 'it-system-usage-details-contracts.component.html',
  styleUrls: ['it-system-usage-details-contracts.component.scss'],
  providers: [ItSystemUsageDetailsContractsComponentStore],
})
export class ITSystemUsageDetailsContractsComponent extends BaseComponent implements OnInit {
  public readonly mainContract$ = this.store.select(selectItSystemUsageMainContract);
  public readonly mainContractIsValid$ = this.store.select(selectItSystemUsageValidAccordingToMainContract);
  public readonly availableContractsForSelection$ = this.contractsStore.associatedContracts$;
  public availableContractTypesDictionary$ = this.store.select(selectContractTypesDictionary).pipe(filterNullish());
  public readonly isLoading$ = this.contractsStore.associatedContractsIsLoading$;
  public readonly contracts$ = this.contractsStore.associatedContracts$.pipe(
    map((contracts: Array<APIItContractResponseDTO>) =>
      contracts.map<AssociatedContractViewModel>((contract) => {
        return {
          ...contract,
          hasOperation: contract.general.agreementElements.some((ae) => ae.name.toLowerCase() === 'drift'),
        };
      })
    )
  );
  public readonly anyContracts$ = this.contracts$.pipe(matchNonEmptyArray());

  public readonly contractSelectionForm = new FormGroup({
    mainContract: new FormControl<APIItContractResponseDTO | undefined>({ value: undefined, disabled: false }),
  });

  constructor(
    private readonly store: Store,
    private readonly contractsStore: ItSystemUsageDetailsContractsComponentStore,
    private readonly notificationService: NotificationService
  ) {
    super();
  }

  public patchMainContract(uuid?: string) {
    if (this.contractSelectionForm.valid) {
      this.store.dispatch(ITSystemUsageActions.patchItSystemUsage({ general: { mainContractUuid: uuid } }));
    } else {
      this.notificationService.showError($localize`System anvendelse er ugyldig`);
    }
  }

  public ngOnInit(): void {
    this.store.dispatch(ContractTypeActions.getContractTypes());

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
