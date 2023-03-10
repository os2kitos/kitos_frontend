import { createFeature, createReducer, on } from '@ngrx/store';
import { UserActions } from './actions';
import { initialState, UserState } from './state';

export const userFeature = createFeature({
  name: 'User',
  reducer: createReducer(
    initialState,
    on(UserActions.login, (state): UserState => ({ ...state, isAuthenticating: true, hasTriedAuthenticating: false })),
    on(
      UserActions.authenticate,
      (state): UserState => ({ ...state, isAuthenticating: true, hasTriedAuthenticating: false })
    ),
    on(
      UserActions.authenticateSuccess,
      (state, { user }): UserState => ({
        ...state,
        user,
        isAuthenticating: false,
        hasTriedAuthenticating: true,
      })
    ),
    on(
      UserActions.authenticateError,
      (state): UserState => ({ ...state, user: undefined, isAuthenticating: false, hasTriedAuthenticating: true })
    ),

    on(UserActions.updateOrganization, (state, { organization }): UserState => ({ ...state, organization }))
  ),
});
