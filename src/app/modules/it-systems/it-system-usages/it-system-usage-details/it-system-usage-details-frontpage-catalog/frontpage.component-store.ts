import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap } from 'rxjs';
import { APIRegularOptionResponseDTO, APIV2ItSystemBusinessTypeService } from 'src/app/api/v2';

interface State {
  businessTypes?: APIRegularOptionResponseDTO[];
}

@Injectable({ providedIn: 'any' })
export class ITSystemUsageDetailsFrontpageCatalogComponentStore extends ComponentStore<State> {
  public readonly businessTypes$ = this.select((state) => state.businessTypes);

  constructor(private apiItSystemBusinessTypeService: APIV2ItSystemBusinessTypeService) {
    super({});
  }

  private updateBusinessTypes = this.updater(
    (state, businessTypes: APIRegularOptionResponseDTO[]): State => ({
      ...state,
      businessTypes,
    })
  );

  public getBusinessTypes = this.effect((organizationUuid$: Observable<string>) =>
    organizationUuid$.pipe(
      switchMap((organizationUuid) =>
        this.apiItSystemBusinessTypeService
          .gETItSystemBusinessTypeV2GetBusinessTypesUnboundedPaginationQueryPaginationGuidOrganizationUuid(
            organizationUuid
          )
          .pipe(
            tapResponse(
              (response) => this.updateBusinessTypes(response),
              (e) => console.error(e)
            )
          )
      )
    )
  );
}
