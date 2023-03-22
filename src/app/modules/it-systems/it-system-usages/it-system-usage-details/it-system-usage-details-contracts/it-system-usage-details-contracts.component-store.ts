import { Injectable, OnDestroy } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { map, mergeMap, Observable } from 'rxjs';
import { APIItContractResponseDTO, APIV2ItContractService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';

interface State {
  loading: boolean;
  contracts?: Array<APIItContractResponseDTO>;
}

interface AssociatedContractRowViewModel extends APIItContractResponseDTO {
  hasOperation: boolean;
}

@Injectable()
export class ItSystemUsageDetailsContractsComponentStore extends ComponentStore<State> implements OnDestroy {
  public readonly associatedContracts$ = this.select((state) => state.contracts).pipe(filterNullish());
  public readonly associatedContractsIsLoading$ = this.select((state) => state.loading).pipe(filterNullish());
  public readonly contractRows$ = this.associatedContracts$.pipe(
    map((contracts: Array<APIItContractResponseDTO>) =>
      contracts.map<AssociatedContractRowViewModel>((contract) => {
        return {
          ...contract,
          hasOperation: contract.general.agreementElements.some((ae) => ae.name.toLowerCase() === 'drift'),
        };
      })
    )
  );

  constructor(private apiDataProcessingRegistrationService: APIV2ItContractService) {
    super({ loading: false });
  }

  private updateAssociatedContracts = this.updater(
    (state, contracts: Array<APIItContractResponseDTO>): State => ({
      ...state,
      contracts: contracts,
    })
  );

  private updateAssociatedContractsIsLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading: loading,
    })
  );

  public getAssociatedContracts = this.effect((systemUsageUuid$: Observable<string>) =>
    systemUsageUuid$.pipe(
      mergeMap((systemUsageUuid) => {
        this.updateAssociatedContractsIsLoading(true);
        return this.apiDataProcessingRegistrationService
          .gETItContractV2GetItContractsBoundedPaginationQueryPaginationQueryNullable1ChangedSinceGtEqNullable1DataProcessingRegistrationUuidNullable1OrganizationUuidNullable1ResponsibleOrgUnitUuidNullable1SupplierUuidNullable1SystemUsageUuidNullable1SystemUuidStringNameContent(
            undefined,
            undefined,
            systemUsageUuid
          )
          .pipe(
            tapResponse(
              (associatedContracts) => this.updateAssociatedContracts(associatedContracts),
              (e) => console.error(e),
              () => this.updateAssociatedContractsIsLoading(false)
            )
          );
      })
    )
  );
}
