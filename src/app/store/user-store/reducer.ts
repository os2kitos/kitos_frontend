import { createFeature, createReducer, on } from '@ngrx/store';
import { UserActions } from './actions';
import { UserState } from './state';

export const userInitialState: UserState = {
  user: undefined,
  isAuthenticating: false,
  hasTriedAuthenticating: false,
  xsrfToken: undefined,

  organization: undefined,
};

export const userFeature = createFeature({
  name: 'User',
  reducer: createReducer(
    userInitialState,
    on(UserActions.login, (state): UserState => ({ ...state, isAuthenticating: true, hasTriedAuthenticating: false })),
    on(
      UserActions.loginSuccess,
      (state, { user }): UserState => ({
        ...state,
        user,
        isAuthenticating: false,
        hasTriedAuthenticating: true,
      })
    ),
    on(
      UserActions.loginError,
      (state): UserState => ({ ...state, user: undefined, isAuthenticating: false, hasTriedAuthenticating: true })
    ),

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

    on(UserActions.updateXsrfToken, (state, { xsrfToken }): UserState => ({ ...state, xsrfToken })),

    on(UserActions.updateOrganization, (state, { organization }): UserState => ({ ...state, organization }))
  ),
});
