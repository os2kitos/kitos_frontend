import { ActionReducer } from '@ngrx/store';
import { businessTypeFeature } from '../business-type/reducer';
import { initialState as businessTypeInitialState } from '../business-type/state';
import { dataClassificationTypeFeature } from '../data-classification-type/reducer';
import { initialState as dataClassificationInitialState } from '../data-classification-type/state';
import { itSystemUsageFeature } from '../it-system-usage/reducer';
import { initialState as itSystemUsageInitialState } from '../it-system-usage/state';
import { itSystemFeature } from '../it-system/reducer';
import { initialState as itSystemInitialState } from '../it-system/state';
import { kleFeature } from '../kle/reducer';
import { initialState as kleInitialState } from '../kle/state';
import { userFeature } from '../user-store/reducer';
import { initialState as userInitialState } from '../user-store/state';
import { resetStateAction } from './actions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resetReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    if (action.type === resetStateAction.type) {
      return reducer(
        {
          [businessTypeFeature.name]: businessTypeInitialState,
          [dataClassificationTypeFeature.name]: dataClassificationInitialState,
          [itSystemFeature.name]: itSystemInitialState,
          [itSystemUsageFeature.name]: itSystemUsageInitialState,
          [kleFeature.name]: kleInitialState,
          [userFeature.name]: userInitialState,
        },
        action
      );
    }

    return reducer(state, action);
  };
}
