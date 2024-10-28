import { createFeature, createReducer, on } from '@ngrx/store';
import { UIRootConfigActions } from './actions';
import { UIRootConfigState } from './state';

export const uiRootConfigInitialState: UIRootConfigState = {
  currentTabModuleKey: undefined,
};

export const uiRootConfigFeature = createFeature({
  name: 'UIRootConfig',
  reducer: createReducer(
    uiRootConfigInitialState,
    on(UIRootConfigActions.setCurrentTabModuleKeySuccess, (state, { moduleKey }): UIRootConfigState => {
      return {
        ...state,
        currentTabModuleKey: moduleKey,
      };
    })
  ),
});
