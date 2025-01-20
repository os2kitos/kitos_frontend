import { Actions, ofType } from '@ngrx/effects';
import { FilterDescriptor, isCompositeFilterDescriptor } from '@progress/kendo-data-query';
import { map, Subscription } from 'rxjs';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';

export function getSaveFilterAction(entityType: RegistrationEntityTypes) {
  switch (entityType) {
    case 'it-system-usage':
      return ITSystemUsageActions.saveITSystemUsageFilter;
    case 'it-system':
      return ITSystemActions.saveITSystemFilter;
    case 'it-interface':
      return ITInterfaceActions.saveITInterfacesFilter;
    case 'it-contract':
      return ITContractActions.saveITContractFilter;
    case 'data-processing-registration':
      return DataProcessingActions.saveDataProcessingFilter;
    case 'organization-user':
      return OrganizationUserActions.saveOrganizationUsersFilter;
    case 'local-admin-organization':
      return OrganizationActions.saveLocalAdminOrganizationsFilter;
    case 'global-admin-organization':
      return OrganizationActions.saveGlobalAdminOrganizationsFilter;
    default:
      throw `Save filter action for entity type ${entityType} not implemented`;
  }
}

export function getApplyFilterAction(entityType: RegistrationEntityTypes) {
  switch (entityType) {
    case 'it-system-usage':
      return ITSystemUsageActions.applyITSystemUsageFilter;
    case 'it-system':
      return ITSystemActions.applyITSystemFilter;
    case 'it-interface':
      return ITInterfaceActions.applyITInterfacesFilter;
    case 'it-contract':
      return ITContractActions.applyITContractFilter;
    case 'data-processing-registration':
      return DataProcessingActions.applyDataProcessingFilter;
    case 'organization-user':
      return OrganizationUserActions.applyOrganizationUsersFilter;
    case 'local-admin-organization':
      return OrganizationActions.applyLocalAdminOrganizationsFilter;
    case 'global-admin-organization':
      return OrganizationActions.applyGlobalAdminOrganizationsFilter;
    default:
      throw `Apply filter action for entity type ${entityType} not implemented`;
  }
}

/*
This function is used to initialize a grid filters subcription for applying the saved filter state.
updateFilter is a function that is used to update the state in the filter component.
*/
export function initializeApplyFilterSubscription(
  actions$: Actions,
  entityType: RegistrationEntityTypes,
  columnField: string,
  updateFilter: (filter: FilterDescriptor | undefined) => void
): Subscription {
  return actions$
    .pipe(
      ofType(getApplyFilterAction(entityType)),
      map(({ state }) => state.filter)
    )
    .subscribe((compFilter) => {
      const matchingFilter = compFilter?.filters.find(
        (filter) => !isCompositeFilterDescriptor(filter) && filter.field === columnField
      ) as FilterDescriptor | undefined;
      updateFilter(matchingFilter);
    });
}
