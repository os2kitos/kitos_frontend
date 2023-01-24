import { createFeature, createReducer, on } from '@ngrx/store';
import { UserActions } from './actions';
import { initialState, UserState } from './state';

export const userFeature = createFeature({
  name: 'user',
  reducer: createReducer(
    initialState,
    on(UserActions.loginUser, (state): UserState => ({ ...state, userLoading: true, userError: false })),
    on(
      UserActions.updateUser,
      (state, { user }): UserState => ({ ...state, user, userLoading: false, userError: false })
    ),
    on(UserActions.loginUserFailed, (state): UserState => ({ ...state, userLoading: false, userError: true }))
  ),
});
