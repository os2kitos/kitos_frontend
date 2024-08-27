import { Actions, ofType } from "@ngrx/effects";
import { FilterDescriptor, isCompositeFilterDescriptor } from "@progress/kendo-data-query";
import { map } from "rxjs";
import { DataProcessingActions } from "src/app/store/data-processing/actions";
import { ITContractActions } from "src/app/store/it-contract/actions";
import { ITInterfaceActions } from "src/app/store/it-system-interfaces/actions";
import { ITSystemUsageActions } from "src/app/store/it-system-usage/actions";
import { ITSystemActions } from "src/app/store/it-system/actions";
import { RegistrationEntityTypes } from "../models/registrations/registration-entity-categories.model";
import { filterNullish } from "../pipes/filter-nullish";

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
    default:
      throw `Apply filter action for entity type ${entityType} not implemented`;
  }
}

/*
This function is used to initialize a grid filters subcription for applying the saved filter state.
updateFilter is a function that is used to update the state in the filter component.
*/
export function initializeApplyFilterSubscription(actions$: Actions, entityType: RegistrationEntityTypes, columnField: string, updateFilter: (filter: FilterDescriptor | undefined) => void) {
  actions$
      .pipe(
        ofType(getApplyFilterAction(entityType)),
        map(({state}) => state.filter),
        filterNullish()
      )
      .subscribe((compFilter) => {
        const matchingFilter = compFilter.filters.find((filter) => !isCompositeFilterDescriptor(filter) && filter.field === columnField) as FilterDescriptor | undefined;
        updateFilter(matchingFilter);
      });
}
