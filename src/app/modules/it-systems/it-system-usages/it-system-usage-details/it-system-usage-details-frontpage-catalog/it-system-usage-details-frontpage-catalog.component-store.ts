import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { mergeMap, Observable, switchMap } from 'rxjs';
import {
  APIItSystemResponseDTO,
  APIKLEDetailsDTO,
  APIRegularOptionResponseDTO,
  APIV2ItSystemBusinessTypeService,
  APIV2ItSystemService,
  APIV2KleOptionService,
} from 'src/app/api/v2';

interface State {
  businessTypes?: APIRegularOptionResponseDTO[];
  kleDetails?: APIKLEDetailsDTO[];
  parentSystem?: APIItSystemResponseDTO;
}

@Injectable({ providedIn: 'any' })
export class ITSystemUsageDetailsFrontpageCatalogComponentStore extends ComponentStore<State> {
  public readonly parentSystem$ = this.select((state) => state.parentSystem);
  public readonly businessTypes$ = this.select((state) => state.businessTypes);
  public readonly kleDetails$ = this.select((state) => state.kleDetails);

  constructor(
    private apiItSystemService: APIV2ItSystemService,
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

  private updateParentSystem = this.updater(
    (state, parentSystem: APIItSystemResponseDTO): State => ({
      ...state,
      parentSystem,
    })
  );

  private addKLEDetail = this.updater(
    (state, kleDetail: APIKLEDetailsDTO): State => ({
      ...state,
      kleDetails: [...(state.kleDetails || []), kleDetail],
    })
  );

  public getParentSystem = this.effect((systemUuid$: Observable<string>) =>
    systemUuid$.pipe(
      mergeMap((systemUuid) =>
        this.apiItSystemService.gETItSystemV2GetItSystemGuidUuid(systemUuid).pipe(
          tapResponse(
            (parentSystem) => this.updateParentSystem(parentSystem),
            (e) => console.error(e)
          )
        )
      )
    )
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
              (businessTypes) => this.updateBusinessTypes(businessTypes),
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
            (kleResponse) => this.addKLEDetail(kleResponse.payload),
            (e) => console.error(e)
          )
        )
      )
    )
  );
}
