import { createFeature, createReducer, on } from "@ngrx/store";
import { UIRootConfigState } from "./state";
import { UIRootConfigActions } from "./actions";

export const uiRootConfigInitialState: UIRootConfigState = {
  currentTabModuleKey: undefined
};

export const UIRootConfigFeature = createFeature({
  name: 'UIRootConfig',
  reducer: createReducer(
    uiRootConfigInitialState,
    on(UIRootConfigActions.setCurrentTabModuleKey, (state, { moduleKey }): UIRootConfigState => {
      return {
        ...state,
        currentTabModuleKey: moduleKey,
      };
    })
  ),
});
