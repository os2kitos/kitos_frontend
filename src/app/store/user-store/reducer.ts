import { createFeature, createReducer, on } from '@ngrx/store';
import { UserActions } from './actions';
import { UserState } from './state';

export const userInitialState: UserState = {
  user: undefined,
  isAuthenticating: false,
  hasTriedAuthenticating: false,
  xsrfToken: undefined,

  organization: undefined,
  hasMultipleOrganizations: undefined,
  gridPermissions: undefined,
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

    on(UserActions.updateXSRFToken, (state, { xsrfToken }): UserState => ({ ...state, xsrfToken })),

    on(UserActions.resetOnOrganizationUpdate, (state, { organization }): UserState => ({ ...state, organization })),
    on(
      UserActions.updateHasMultipleOrganizations,
      (state, { hasMultipleOrganizations }): UserState => ({ ...state, hasMultipleOrganizations })
    ),

    on(
      UserActions.getUserGridPermissionsSuccess,
      (state, { response }): UserState => ({ ...state, gridPermissions: response })
    ),
    on(UserActions.patchOrganizationSuccess, (state, organization): UserState => ({ ...state, organization }))
  ),
});
