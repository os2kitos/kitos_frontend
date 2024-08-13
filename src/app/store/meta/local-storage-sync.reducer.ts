import { ActionReducer } from '@ngrx/store';
import { LocalStorageConfig, localStorageSync } from 'ngrx-store-localstorage';
import { userFeature } from '../user-store/reducer';
import { itSystemUsageFeature } from '../it-system-usage/reducer';

const localStorageSyncOptions: LocalStorageConfig = {
  keys: [{ [userFeature.name]: ['organization'] }, { [itSystemUsageFeature.name]: ['sort'] }],
  rehydrate: true,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync(localStorageSyncOptions)(reducer);
}
