import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { APIIdentityNamePairResponseDTO, APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import { selectOrganizationUnits } from 'src/app/store/organization-unit/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  loading: boolean;
  organizationUnits?: Array<APIOrganizationUnitResponseDTO>;
}

@Injectable()
export class ItSystemUsageDetailsOrganizationComponentStore extends ComponentStore<State> {
  public readonly organizationUnits$ = this.store.select(selectOrganizationUnits).pipe(filterNullish());
  /* .pipe(
      map((units) => {
        var result = [] as APIIdentityNamePairResponseDTO[];
        units
          .filter((unit) => !unit.parentOrganizationUnit)
          .forEach((unit) => {
            result = result.concat(this.mapHierarchy(unit, units));
          });
        return result;
      })
    ) */
  public readonly organizationUnitsIsLoading$ = this.select((state) => state.loading).pipe(filterNullish());

  constructor(private store: Store) {
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

  private mapHierarchy(
    currentUnit: APIOrganizationUnitResponseDTO,
    units: Array<APIOrganizationUnitResponseDTO>,
    indetation: number = 0
  ): APIIdentityNamePairResponseDTO[] {
    var result = [
      { uuid: currentUnit.uuid, name: '1'.repeat(indetation) + currentUnit.name },
    ] as APIIdentityNamePairResponseDTO[];

    var childrenResult = [] as APIIdentityNamePairResponseDTO[];
    units
      .filter((x) => x.parentOrganizationUnit?.uuid === currentUnit.uuid)
      .forEach((newUnit) => {
        childrenResult = childrenResult.concat(this.mapHierarchy(newUnit, units, indetation + 1));
      });

    return result.concat(childrenResult);
  }
}
