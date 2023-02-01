import { createFeature, createReducer, on } from '@ngrx/store';
import { UserActions } from './actions';
import { initialState, UserState } from './state';

export const userFeature = createFeature({
  name: 'user',
  reducer: createReducer(
    initialState,
    on(UserActions.login, (state): UserState => ({ ...state, isAuthenticating: true, hasAuthenticated: false })),
    on(UserActions.authenticate, (state): UserState => ({ ...state, isAuthenticating: true, hasAuthenticated: false })),
    on(
      UserActions.authenticateSuccess,
      (state, { user }): UserState => ({
        ...state,
        user,
        isAuthenticating: false,
        hasAuthenticated: true,
      })
    ),
    on(
      UserActions.authenticateError,
      (state): UserState => ({ ...state, isAuthenticating: false, hasAuthenticated: true })
    ),

    on(UserActions.clear, (): UserState => initialState),

    on(UserActions.updateOrganization, (state, { organization }): UserState => ({ ...state, organization }))
  ),
});
