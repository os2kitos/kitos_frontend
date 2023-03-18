import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { APIItContractResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { ContractTypeActions } from 'src/app/store/contract-type/actions';
import { selectContractTypesDictionary } from 'src/app/store/contract-type/selectors';
import { selectItSystemUsageUuid } from 'src/app/store/it-system-usage/selectors';
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

  constructor(
    private readonly store: Store,
    private readonly contractsStore: ItSystemUsageDetailsContractsComponentStore
  ) {
    super();
  }

  public ngOnInit(): void {
    this.store.dispatch(ContractTypeActions.getContractTypes());

    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageUuid)
        .pipe(filterNullish())
        .subscribe((itSystemUsageUuid) => this.contractsStore.getAssociatedContracts(itSystemUsageUuid))
    );
  }
}
