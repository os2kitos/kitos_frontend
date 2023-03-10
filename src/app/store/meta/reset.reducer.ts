import { ActionReducer } from '@ngrx/store';
import { businessTypeFeature } from '../business-type/reducer';
import { businessTypeInitialState } from '../business-type/state';
import { dataClassificationTypeFeature } from '../data-classification-type/reducer';
import { dataClassificationTypeInitialState } from '../data-classification-type/state';
import { itSystemUsageFeature } from '../it-system-usage/reducer';
import { itSystemUsageInitialState } from '../it-system-usage/state';
import { itSystemFeature } from '../it-system/reducer';
import { itSystemInitialState } from '../it-system/state';
import { kleFeature } from '../kle/reducer';
import { kleInitialState } from '../kle/state';
import { organizationFeature } from '../organization/reducer';
import { organizationInitialState } from '../organization/state';
import { userFeature } from '../user-store/reducer';
import { userInitialState } from '../user-store/state';
import { resetOrganizationStateAction, resetStateAction } from './actions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resetReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    const initialStateDependingOnOrganization = {
      [businessTypeFeature.name]: businessTypeInitialState,
      [dataClassificationTypeFeature.name]: dataClassificationTypeInitialState,
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
