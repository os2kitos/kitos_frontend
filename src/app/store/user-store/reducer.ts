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
      UserActions.authenticateSuccess,
      (state, { user }): UserState => ({ ...state, user, hasAuthenticated: true, userLoading: false })
    ),
    on(UserActions.authenticateError, (state): UserState => ({ ...state, hasAuthenticated: true, userLoading: false })),

    on(UserActions.clear, (): UserState => initialState),

    on(UserActions.updateOrganization, (state, { organization }): UserState => ({ ...state, organization }))
  ),
});
