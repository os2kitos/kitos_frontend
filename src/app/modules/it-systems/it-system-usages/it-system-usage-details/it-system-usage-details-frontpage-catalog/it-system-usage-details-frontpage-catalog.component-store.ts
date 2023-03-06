import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { mergeMap, Observable, switchMap } from 'rxjs';
import {
  APIKLEDetailsDTO,
  APIRegularOptionResponseDTO,
  APIV2ItSystemBusinessTypeService,
  APIV2KleOptionService,
} from 'src/app/api/v2';

interface State {
  businessTypes?: APIRegularOptionResponseDTO[];
  kleDetails?: APIKLEDetailsDTO[];
}

@Injectable({ providedIn: 'any' })
export class ITSystemUsageDetailsFrontpageCatalogComponentStore extends ComponentStore<State> {
  public readonly businessTypes$ = this.select((state) => state.businessTypes);
  public readonly kleDetails$ = this.select((state) => state.kleDetails);

  constructor(
    private apiItSystemBusinessTypeService: APIV2ItSystemBusinessTypeService,
    private apiKleOptionService: APIV2KleOptionService
  ) {
    super({});
  }

  private updateBusinessTypes = this.updater(
    (state, businessTypes: APIRegularOptionResponseDTO[]): State => ({
      ...state,
      businessTypes,
    })
  );

  private addKLEDetail = this.updater(
    (state, kleDetail: APIKLEDetailsDTO): State => ({
      ...state,
      kleDetails: [...(state.kleDetails || []), kleDetail],
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

  public getKLEDetail = this.effect((kleUuid$: Observable<string>) =>
    kleUuid$.pipe(
      mergeMap((kleUuid) =>
        this.apiKleOptionService.gETKleOptionV2GetGuidKleUuid(kleUuid).pipe(
          tapResponse(
            (response) => this.addKLEDetail(response.payload),
            (e) => console.error(e)
          )
        )
      )
    )
  );
}
