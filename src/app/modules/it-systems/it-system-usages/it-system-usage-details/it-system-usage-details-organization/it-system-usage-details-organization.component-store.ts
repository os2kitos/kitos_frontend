import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { APIOrganizationUnitResponseDTO, APIV2OrganizationService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectItSystemUsageResponsibleUnit,
  selectItSystemUsageUsingOrganizationUnits,
  selectItSystemUsageUuid,
} from 'src/app/store/it-system-usage/selectors';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  loading: boolean;
  organizationUnits?: Array<APIOrganizationUnitResponseDTO>;
}

@Injectable()
export class ItSystemUsageDetailsOrganizationComponentStore extends ComponentStore<State> {
  public readonly responsibleUnit$ = this.store.select(selectItSystemUsageResponsibleUnit).pipe(filterNullish());
  public readonly usedByUnits$ = this.store.select(selectItSystemUsageUsingOrganizationUnits).pipe(filterNullish());
  public readonly organizationUnits$ = this.select((state) => state.organizationUnits).pipe(filterNullish());

  public readonly organizationUnitsIsLoading$ = this.select((state) => state.loading).pipe(filterNullish());

  constructor(private store: Store, private apiOrganziationUnitService: APIV2OrganizationService) {
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

  public getOrganizationUnits() {
    this.store
      .select(selectOrganizationUuid)
      .pipe(filterNullish())
      .subscribe((organizationUuid) =>
        this.store.dispatch(OrganizationUnitActions.getOrganizationUnits(organizationUuid))
      );
  }

  public updateUsageUsingUnitsState() {
    this.store
      .select(selectItSystemUsageUuid)
      .pipe(filterNullish())
      .subscribe((usageUuid) => this.store.dispatch(ITSystemUsageActions.getItSystemUsage(usageUuid)));
  }
}
