import { Action, ActionReducer } from "@ngrx/store";
import { ITSystemUsageActions } from "../it-system-usage/actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportReadyMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action: Action) => {
    if (action.type === ITSystemUsageActions.getITSystemUsagesSuccess.type) {
      if (state.GridExport.isExporting) {
        const newState = {
          ...state,
          GridExport: {
            ...state.GridExport,
            readyToExport: true
          }
        };
        return reducer(newState, action);
      }
    }
    return reducer(state, action);
  };
}
