import { createSelector } from '@ngrx/store';
import { userFeature } from './reducer';

export const { selectUser, selectUserIsFetching } = userFeature;

export const selectUserName = createSelector(userFeature.selectUser, (user) => user?.name ?? '');
