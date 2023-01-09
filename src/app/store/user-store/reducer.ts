import { createFeature, createReducer, on } from '@ngrx/store';
import { UserActions } from './actions';
import { UserState, initialState } from './state';

export const userFeature = createFeature({
  name: 'user',
  reducer: createReducer(
    initialState,
    on(UserActions.getUser, (state): UserState => ({ ...state, userIsFetching: true })),
    on(UserActions.updateUser, (state, { user }): UserState => ({ ...state, user, userIsFetching: false }))
  ),
});
