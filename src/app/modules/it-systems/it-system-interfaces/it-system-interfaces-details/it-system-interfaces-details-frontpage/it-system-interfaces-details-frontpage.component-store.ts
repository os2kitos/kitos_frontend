import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, mergeMap } from 'rxjs';
import { APIItSystemResponseDTO, APIV2ItSystemInternalINTERNALService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';

interface State {
  isLoading: boolean;
  itSystems?: APIItSystemResponseDTO[];
  isLoadingOrganizations: boolean;
}

@Injectable()
export class ITSystemInterfacesDetailsFrontpageComponentStore extends ComponentStore<State> {
  public readonly itSystems$ = this.select((state) => state.itSystems).pipe(filterNullish());
  public readonly isLoading$ = this.select((state) => state.isLoading);

  constructor(private apiItSystemInternalService: APIV2ItSystemInternalINTERNALService) {
    super({ isLoading: false, isLoadingOrganizations: false });
  }

  private updateIsLoading = this.updater((state, isLoading: boolean): State => ({ ...state, isLoading: isLoading }));

  private updateItSystems = this.updater(
    (state, itSystems: APIItSystemResponseDTO[]): State => ({ ...state, itSystems })
  );

  public searchItSystems = this.effect((searchTerm$: Observable<string | undefined>) =>
    searchTerm$.pipe(
      mergeMap((searchTerm) => {
        this.updateIsLoading(true);
        return this.apiItSystemInternalService
          .getManyItSystemInternalV2GetItSystems({
            nameContains: searchTerm,
            includeDeactivated: false,
          })
          .pipe(
            tapResponse(
              (itSystems: APIItSystemResponseDTO[]) => this.updateItSystems(itSystems),
              (e) => console.error(e),
              () => this.updateIsLoading(false)
            )
          );
      })
    )
  );
}
