import { Injectable, OnDestroy } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { mergeMap, Observable } from 'rxjs';
import { APIItContractResponseDTO, APIV2ItContractService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';

interface State {
  contracts?: Array<APIItContractResponseDTO>;
}

@Injectable()
export class ItSystemUsageDetailsContractsComponentStore extends ComponentStore<State> implements OnDestroy {
  public readonly associatedContracts$ = this.select((state) => state.contracts).pipe(filterNullish());

  constructor(private apiDataProcessingRegistrationService: APIV2ItContractService) {
    super({});
  }

  private updateAssociatedContracts = this.updater(
    (state, contracts: Array<APIItContractResponseDTO>): State => ({
      ...state,
      contracts: contracts,
    })
  );

  public getAssociatedDataProcessingRegistrations = this.effect((systemUsageUuid$: Observable<string>) =>
    systemUsageUuid$.pipe(
      mergeMap((systemUsageUuid) =>
        this.apiDataProcessingRegistrationService
          .gETItContractV2GetItContractsBoundedPaginationQueryPaginationQueryNullable1ChangedSinceGtEqNullable1DataProcessingRegistrationUuidNullable1OrganizationUuidNullable1ResponsibleOrgUnitUuidNullable1SupplierUuidNullable1SystemUsageUuidNullable1SystemUuidStringNameContent(
            undefined,
            undefined,
            systemUsageUuid
          )
          .pipe(
            tapResponse(
              (associatedContracts) => this.updateAssociatedContracts(associatedContracts),
              (e) => console.error(e)
            )
          )
      )
    )
  );
}
