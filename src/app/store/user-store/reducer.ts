import { createFeature, createReducer, on } from '@ngrx/store';
import { UserActions } from './actions';
import { initialState, UserState } from './state';

export const userFeature = createFeature({
  name: 'user',
  reducer: createReducer(
    initialState,
    on(UserActions.login, (state): UserState => ({ ...state, userLoading: true })),
    on(UserActions.authenticate, (state): UserState => ({ ...state, hasAuthenticated: false, userLoading: true })),
    on(
      UserActions.authenticated,
      (state, { user }): UserState => ({ ...state, user, hasAuthenticated: true, userLoading: false })
    ),
    on(UserActions.update, (state, { user }): UserState => ({ ...state, user, userLoading: false })),

    on(UserActions.clear, (): UserState => initialState),

    on(UserActions.updateXsrfToken, (state, { xsrfToken }): UserState => ({ ...state, xsrfToken })),

    on(UserActions.updateOrganization, (state, { organization }): UserState => ({ ...state, organization }))
  ),
});
