import { createSelector } from "@ngrx/store";
import { helpTextFeature } from "./reducer";

const { selectHelpTextState } = helpTextFeature;

export const selectHelpTexts = createSelector(selectHelpTextState,
  (state) => state.helpTexts
);
