import { Action, ActionReducer } from '@ngrx/store';
import { DataProcessingActions } from '../data-processing/actions';
import { ITContractActions } from '../it-contract/actions';
import { ITInterfaceActions } from '../it-system-interfaces/actions';
import { ITSystemUsageActions } from '../it-system-usage/actions';
import { ITSystemActions } from '../it-system/actions';
import { OrganizationUserActions } from '../organization/organization-user/actions';
import { OrganizationActions } from '../organization/actions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportReadyMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action: Action) => {
    if (
      action.type === ITSystemUsageActions.getITSystemUsagesSuccess.type ||
      action.type === ITInterfaceActions.getITInterfacesSuccess.type ||
      action.type === ITSystemActions.getITSystemsSuccess.type ||
      action.type === DataProcessingActions.getDataProcessingsSuccess.type ||
      action.type === ITContractActions.getITContractsSuccess.type ||
      action.type === OrganizationUserActions.getOrganizationUsersSuccess.type ||
      action.type === OrganizationActions.getOrganizationsSuccess.type
    ) {
      const newState = reducer(state, action);
      if (newState.GridExport.isExporting) {
        return {
          ...newState,
          GridExport: {
            ...newState.GridExport,
            readyToExport: true,
          },
        };
      }
      return newState;
    }
    return reducer(state, action);
  };
}
