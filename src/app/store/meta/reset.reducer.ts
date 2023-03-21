import { ActionReducer } from '@ngrx/store';
import { businessTypeFeature, businessTypeInitialState } from '../business-type/reducer';
import { contractTypeFeature, contractTypeInitialState } from '../contract-type/reducer';
import { dataClassificationTypeFeature, dataClassificationTypeInitialState } from '../data-classification-type/reducer';
import { itSystemUsageFeature, itSystemUsageInitialState } from '../it-system-usage/reducer';
import { itSystemFeature, itSystemInitialState } from '../it-system/reducer';
import { kleFeature, kleInitialState } from '../kle/reducer';
import { organizationFeature, organizationInitialState } from '../organization/reducer';
import { userFeature, userInitialState } from '../user-store/reducer';
import { resetOrganizationStateAction, resetStateAction } from './actions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resetReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    const initialStateDependingOnOrganization = {
      [businessTypeFeature.name]: businessTypeInitialState,
      [dataClassificationTypeFeature.name]: dataClassificationTypeInitialState,
      [contractTypeFeature.name]: contractTypeInitialState,
      [itSystemFeature.name]: itSystemInitialState,
      [itSystemUsageFeature.name]: itSystemUsageInitialState,
    };

    switch (action.type) {
      case resetStateAction.type:
        return reducer(
          {
            ...state,
            ...initialStateDependingOnOrganization,
            [kleFeature.name]: kleInitialState,
            [organizationFeature.name]: organizationInitialState,
            [userFeature.name]: userInitialState,
          },
          action
        );
      case resetOrganizationStateAction.type:
        return reducer(
          {
            ...state,
            ...initialStateDependingOnOrganization,
          },
          action
        );
    }

    return reducer(state, action);
  };
}
