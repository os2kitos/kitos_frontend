import { createSelector } from '@ngrx/store';
import { uiRootConfigFeature } from './reducer';
import { UIRootConfigState } from './state';

const { selectUIRootConfigState } = uiRootConfigFeature;

export const selectCurrentTabModuleKey = createSelector(
  selectUIRootConfigState,
  (state: UIRootConfigState) => {
    console.log(JSON.stringify(state) + '   is state');
    return state.currentTabModuleKey}
);
