import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { map } from 'rxjs';
import { APIItContractResponseDTO } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectItSystemUsageAssociatedContracts,
  selectItSystemUsageAssociatedContractsIsLoading,
} from 'src/app/store/it-system-usage/selectors';

interface AssociatedContractRowViewModel extends APIItContractResponseDTO {
  hasOperation: boolean;
}

@Injectable()
export class ItSystemUsageDetailsContractsComponentStore {
  public readonly associatedContracts$ = this.store.select(selectItSystemUsageAssociatedContracts).pipe(filterNullish());
  public readonly associatedContractsLoaded$ = this.store.select(selectItSystemUsageAssociatedContracts).pipe(
    map((contracts) => contracts !== undefined),
  );
  public readonly associatedContractsIsLoading$ = this.store.select(selectItSystemUsageAssociatedContractsIsLoading);
  public readonly contractRows$ = this.associatedContracts$.pipe(
    map((contracts: Array<APIItContractResponseDTO>) =>
      contracts.map<AssociatedContractRowViewModel>((contract) => {
        return {
          ...contract,
          hasOperation: contract.general.agreementElements.some((ae) => ae.name.toLowerCase() === 'drift'),
        };
      }),
    ),
  );

  constructor(private store: Store) {}

  public getAssociatedContracts(systemUsageUuid: string): void {
    this.store.dispatch(ITSystemUsageActions.getAssociatedContracts(systemUsageUuid));
  }
}
