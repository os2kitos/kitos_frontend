import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, mergeMap } from 'rxjs';
import {
  APIItSystemResponseDTO,
  APIOrganizationResponseDTO,
  APIV2ItSystemService,
  APIV2OrganizationService,
} from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';

interface State {
  parentSystem?: APIItSystemResponseDTO;
  isLoading: boolean;
  itSystems?: APIItSystemResponseDTO[];
  organizations?: APIOrganizationResponseDTO[];
  isLoadingOrganizations: boolean;
}

@Injectable()
export class ITSystemCatalogDetailsFrontpageComponentStore extends ComponentStore<State> {
  public readonly parentSystem$ = this.select((state) => state.parentSystem);
  public readonly isLoading$ = this.select((state) => state.isLoading);
  public readonly itSystems$ = this.select((state) => state.itSystems).pipe(filterNullish());
  public readonly organizations$ = this.select((state) => state.organizations).pipe(filterNullish());
  public readonly isLoadingOrganizations$ = this.select((state) => state.isLoadingOrganizations);

  constructor(
    private apiItSystemService: APIV2ItSystemService,
    private apiOrganizationService: APIV2OrganizationService
  ) {
    super({ isLoading: false, isLoadingOrganizations: false });
  }

  private updateParentSystem = this.updater(
    (state, parentSystem: APIItSystemResponseDTO): State => ({
      ...state,
      parentSystem,
    })
  );

  private updateIsLoading = this.updater((state, isLoading: boolean): State => ({ ...state, isLoading: isLoading }));

  private updateItSystems = this.updater(
    (state, itSystems: APIItSystemResponseDTO[]): State => ({ ...state, itSystems })
  );

  private updateIsLoadingOrganizations = this.updater(
    (state, isLoadingOrganizations: boolean): State => ({ ...state, isLoadingOrganizations })
  );

  private updateOrganizations = this.updater(
    (state, organizations: APIOrganizationResponseDTO[]): State => ({ ...state, organizations })
  );

  public getParentSystem = this.effect((systemUuid$: Observable<string>) =>
    systemUuid$.pipe(
      mergeMap((uuid) =>
        this.apiItSystemService.getSingleItSystemV2GetItSystem({ uuid }).pipe(
          tapResponse(
            (parentSystem: APIItSystemResponseDTO) => this.updateParentSystem(parentSystem),
            (e) => console.error(e)
          )
        )
      )
    )
  );

  public searchItSystems = this.effect((searchTerm$: Observable<string | undefined>) =>
    searchTerm$.pipe(
      mergeMap((searchTerm) => {
        this.updateIsLoading(true);
        return this.apiItSystemService.getManyItSystemV2GetItSystems({ nameContains: searchTerm }).pipe(
          tapResponse(
            (itSystems: APIItSystemResponseDTO[]) => this.updateItSystems(itSystems),
            (e) => console.error(e),
            () => this.updateIsLoading(false)
          )
        );
      })
    )
  );

  public searchRightsHolderOrganizations = this.effect((searchTerm$: Observable<string | undefined>) =>
    searchTerm$.pipe(
      mergeMap((searchTerm) => {
        this.updateIsLoadingOrganizations(true);
        return this.apiOrganizationService.getManyOrganizationV2GetOrganizations({ nameOrCvrContent: searchTerm }).pipe(
          tapResponse(
            (organizations) => this.updateOrganizations(organizations),
            (e) => console.error(e),
            () => this.updateIsLoadingOrganizations(false)
          )
        );
      })
    )
  );
}
