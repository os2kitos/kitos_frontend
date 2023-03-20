import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { APIOrganizationUnitResponseDTO, APIV2OrganizationService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';

interface State {
  loading: boolean;
  organizationUnits?: Array<APIOrganizationUnitResponseDTO>;
}

@Injectable()
export class ItSystemOrganizationComponentStore extends ComponentStore<State> {
  public readonly organizationUnits$ = this.select((state) => state.organizationUnits).pipe(filterNullish());

  public readonly organizationUnitsIsLoading$ = this.select((state) => state.loading).pipe(filterNullish());

  constructor(private apiOrganziationUnitService: APIV2OrganizationService) {
    super({ loading: false });
  }

  private updateOrganizationUnits = this.updater(
    (state, organizationUnits: Array<APIOrganizationUnitResponseDTO>): State => ({
      ...state,
      organizationUnits,
    })
  );

  private updateOrganziationUnitsIsLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    })
  );
}
