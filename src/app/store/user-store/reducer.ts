import { createFeature, createReducer, on } from '@ngrx/store';
import { UserActions } from './actions';
import { initialState, UserState } from './state';

export const userFeature = createFeature({
  name: 'user',
  reducer: createReducer(
    initialState,
    on(UserActions.loginUser, (state): UserState => ({ ...state, userLoading: true })),
    on(UserActions.updateUser, (state, { user }): UserState => ({ ...state, user, userLoading: false }))
  ),
});
