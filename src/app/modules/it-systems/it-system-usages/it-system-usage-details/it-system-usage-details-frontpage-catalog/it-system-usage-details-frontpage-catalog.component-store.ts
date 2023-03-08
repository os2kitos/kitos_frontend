import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { mergeMap, Observable } from 'rxjs';
import { APIItSystemResponseDTO, APIKLEDetailsDTO, APIV2ItSystemService, APIV2KleOptionService } from 'src/app/api/v2';

interface State {
  kleDetails?: APIKLEDetailsDTO[];
  parentSystem?: APIItSystemResponseDTO;
}

@Injectable({ providedIn: 'any' })
export class ITSystemUsageDetailsFrontpageCatalogComponentStore extends ComponentStore<State> {
  public readonly parentSystem$ = this.select((state) => state.parentSystem);
  public readonly kleDetails$ = this.select((state) => state.kleDetails);

  constructor(private apiItSystemService: APIV2ItSystemService, private apiKleOptionService: APIV2KleOptionService) {
    super({});
  }

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
