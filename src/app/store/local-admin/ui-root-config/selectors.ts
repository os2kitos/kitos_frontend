import { createSelector } from "@ngrx/store";
import { UIRootConfigFeature } from "./reducer";

const { selectUIRootConfigState } = UIRootConfigFeature;

export const selectCurrentTabModuleKey = createSelector(selectUIRootConfigState, (state) => state.currentTabModuleKey);
