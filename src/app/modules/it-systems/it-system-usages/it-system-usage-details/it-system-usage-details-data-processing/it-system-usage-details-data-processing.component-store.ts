import { Injectable, OnDestroy } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { mergeMap, Observable } from 'rxjs';
import { APIDataProcessingRegistrationResponseDTO, APIV2DataProcessingRegistrationService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';

interface State {
  dataProcessingRegistrations?: Array<APIDataProcessingRegistrationResponseDTO>
}

@Injectable()
export class ItSystemUsageDetailsDataProcessingComponentStore extends ComponentStore<State> implements OnDestroy {
  public readonly associatedDataProcessingRegistrations$ = this
    .select((state) => state.dataProcessingRegistrations)
    .pipe(filterNullish());

  constructor(private apiDataProcessingRegistrationService: APIV2DataProcessingRegistrationService) {
    super({});
  }

  private updateAssociatedDataProcessingRegistrations = this.updater(
    (state, dataProcessingRegistrations: Array<APIDataProcessingRegistrationResponseDTO>): State => ({
      ...state,
      dataProcessingRegistrations,
    })
  );

  public getAssociatedDataProcessingRegistrations = this.effect((systemUsageUuid$: Observable<string>) =>
    systemUsageUuid$.pipe(
      mergeMap((systemUsageUuid) =>
        this.apiDataProcessingRegistrationService.gETDataProcessingRegistrationV2GetDataProcessingRegistrationsBoundedPaginationQueryPaginationQueryNullable1AgreementConcludedNullable1ChangedSinceGtEqNullable1DataProcessorUuidNullable1OrganizationUuidNullable1SubDataProcessorUuidNullable1SystemUsageUuidNullable1SystemUuid(undefined, undefined, systemUsageUuid)
          .pipe(
            tapResponse(
              (dataProcessingRegistrations) => this.updateAssociatedDataProcessingRegistrations(dataProcessingRegistrations),
              (e) => console.error(e)
            )
          )
      )
    )
  );
}
