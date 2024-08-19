import { Action, ActionReducer } from "@ngrx/store";
import { ITSystemUsageActions } from "../it-system-usage/actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportReadyMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action: Action) => {
    if (action.type === ITSystemUsageActions.getITSystemUsagesSuccess.type) {
      const newState = reducer(state, action);
      if (newState.GridExport.isExporting) {
        return {
          ...newState,
          GridExport: {
            ...newState.GridExport,
            readyToExport: true
          }
        };
      }
      return newState;
    }
    return reducer(state, action);
  };
}
