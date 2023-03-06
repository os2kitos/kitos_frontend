import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap } from 'rxjs';
import { APIRegularOptionExtendedResponseDTO, APIV2ItSystemUsageDataClassificationTypeService } from 'src/app/api/v2';

interface State {
  dataClassificationTypes?: APIRegularOptionExtendedResponseDTO[];
}

@Injectable({ providedIn: 'any' })
export class ITSystemUsageDetailsFrontpageInformationComponentStore extends ComponentStore<State> {
  public readonly dataClassificationTypes$ = this.select((state) => state.dataClassificationTypes);

  constructor(private apiItSystemUsageDataClassificationTypeService: APIV2ItSystemUsageDataClassificationTypeService) {
    super({});
  }

  private updateDataClassificationTypes = this.updater(
    (state, dataClassificationTypes: APIRegularOptionExtendedResponseDTO[]): State => ({
      ...state,
      dataClassificationTypes,
    })
  );

  public getDataClassificationTypes = this.effect((organizationUuid$: Observable<string>) =>
    organizationUuid$.pipe(
      switchMap((organizationUuid) =>
        this.apiItSystemUsageDataClassificationTypeService
          .gETItSystemUsageDataClassificationTypeV2GetUnboundedPaginationQueryPaginationGuidOrganizationUuid(
            organizationUuid
          )
          .pipe(
            tapResponse(
              (response) => this.updateDataClassificationTypes(response),
              (e) => console.error(e)
            )
          )
      )
    )
  );
}
