import { Action, ActionReducer } from "@ngrx/store";
import { ITSystemUsageActions } from "../it-system-usage/actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportReadyMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action: Action) => {
    const nextState = reducer(state, action);
    if (action.type === ITSystemUsageActions.getITSystemUsagesSuccess.type) {
      if (state?.isExporting) {
        state.readyToExport = true;
      }
    }
    return nextState;
  };
}
