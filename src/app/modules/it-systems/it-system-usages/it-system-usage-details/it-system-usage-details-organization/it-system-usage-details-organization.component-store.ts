import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { mergeMap } from 'rxjs';
import {
  APIOrganizationUnitResponseDTO,
  APIUpdateItSystemUsageRequestDTO,
  APIV2ItSystemUsageService,
} from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectItSystemUsage,
  selectItSystemUsageResponsibleUnit,
  selectItSystemUsageUsingOrganizationUnits,
  selectItSystemUsageUuid,
} from 'src/app/store/it-system-usage/selectors';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import { selectOrganizationUnits } from 'src/app/store/organization-unit/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  loading: boolean;
  organizationUnits?: Array<APIOrganizationUnitResponseDTO>;
}

@Injectable()
export class ItSystemUsageDetailsOrganizationComponentStore extends ComponentStore<State> {
  public readonly responsibleUnit$ = this.store.select(selectItSystemUsageResponsibleUnit).pipe(filterNullish());
  public readonly usedByUnits$ = this.store.select(selectItSystemUsageUsingOrganizationUnits).pipe(filterNullish());
  public readonly organizationUnits$ = this.store.select(selectOrganizationUnits).pipe(filterNullish());

  public readonly organizationUnitsIsLoading$ = this.select((state) => state.loading).pipe(filterNullish());

  constructor(private store: Store, private itSystemUsageService: APIV2ItSystemUsageService) {
    super({ loading: false });
  }

  public getOrganizationUnits() {
    this.store
      .select(selectOrganizationUuid)
      .pipe(filterNullish())
      .subscribe((organizationUuid) =>
        this.store.dispatch(OrganizationUnitActions.getOrganizationUnits(organizationUuid))
      );
  }

  public addUsedByUnit(unit: APIOrganizationUnitResponseDTO) {
    this.store
      .select(selectItSystemUsage)
      .pipe(filterNullish())
      .pipe(
        mergeMap((usage) => {
          var usingUnitsUuids = usage.organizationUsage.usingOrganizationUnits.map((usingUnit) => usingUnit.uuid);
          usingUnitsUuids.push(unit.uuid);
          return this.itSystemUsageService
            .pATCHItSystemUsageV2PatchSystemUsageUpdateItSystemUsageRequestDTORequestGuidSystemUsageUuid(usage.uuid, {
              organizationUsage: {
                responsibleOrganizationUnitUuid: usage.organizationUsage.responsibleOrganizationUnit?.uuid,
                usingOrganizationUnitUuids: usingUnitsUuids,
              },
            } as APIUpdateItSystemUsageRequestDTO)
            .pipe(
              tapResponse(
                (updatedUsage) => console.log('success'),
                (e) => console.error(e)
              )
            );
        })
      );
  }

  public getUsageUsingUnitsState() {
    this.store
      .select(selectItSystemUsageUuid)
      .pipe(filterNullish())
      .subscribe((usageUuid) => this.store.dispatch(ITSystemUsageActions.getItSystemUsage(usageUuid)));
  }
}
