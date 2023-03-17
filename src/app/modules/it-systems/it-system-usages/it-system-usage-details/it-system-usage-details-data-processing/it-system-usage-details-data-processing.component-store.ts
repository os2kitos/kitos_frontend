import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { mergeMap, Observable } from 'rxjs';
import { APIDataProcessingRegistrationResponseDTO, APIV2DataProcessingRegistrationService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';

interface State {
  loading?: boolean;
  dataProcessingRegistrations?: Array<APIDataProcessingRegistrationResponseDTO>;
}

@Injectable()
export class ItSystemUsageDetailsDataProcessingComponentStore extends ComponentStore<State> {
  public readonly associatedDataProcessingRegistrations$ = this.select(
    (state) => state.dataProcessingRegistrations
  ).pipe(filterNullish());

  public readonly associatedDataProcessingRegistrationsIsLoading$ = this.select((state) => state.loading).pipe(
    filterNullish()
  );

  constructor(private apiDataProcessingRegistrationService: APIV2DataProcessingRegistrationService) {
    super({});
  }

  private updateAssociatedDataProcessingRegistrations = this.updater(
    (state, dataProcessingRegistrations: Array<APIDataProcessingRegistrationResponseDTO>): State => ({
      ...state,
      dataProcessingRegistrations,
    })
  );

  private updateAssociatedDataProcessingRegistrationsIsLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading: loading,
    })
  );

  public getAssociatedDataProcessingRegistrations = this.effect((systemUsageUuid$: Observable<string>) =>
    systemUsageUuid$.pipe(
      mergeMap((systemUsageUuid) => {
        this.updateAssociatedDataProcessingRegistrationsIsLoading(true);
        return this.apiDataProcessingRegistrationService
          .gETDataProcessingRegistrationV2GetDataProcessingRegistrationsBoundedPaginationQueryPaginationQueryNullable1AgreementConcludedNullable1ChangedSinceGtEqNullable1DataProcessorUuidNullable1OrganizationUuidNullable1SubDataProcessorUuidNullable1SystemUsageUuidNullable1SystemUuid(
            undefined,
            undefined,
            systemUsageUuid
          )
          .pipe(
            tapResponse(
              (dataProcessingRegistrations) => {
                this.updateAssociatedDataProcessingRegistrationsIsLoading(false);
                return this.updateAssociatedDataProcessingRegistrations(dataProcessingRegistrations);
              },
              (e) => {
                this.updateAssociatedDataProcessingRegistrationsIsLoading(false);
                console.error(e);
              }
            )
          );
      })
    )
  );
}
