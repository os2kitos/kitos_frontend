import { ActionReducer } from '@ngrx/store';
import { LocalStorageConfig, localStorageSync } from 'ngrx-store-localstorage';
import { userFeature } from '../user-store/reducer';

const localStorageSyncOptions: LocalStorageConfig = {
  keys: [{ [userFeature.name]: ['organization'] }],
  rehydrate: true,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync(localStorageSyncOptions)(reducer);
}
