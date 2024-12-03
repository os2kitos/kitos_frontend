/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { RouterStateSnapshot, UrlSerializer, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { first, Observable } from 'rxjs';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectHasCheckedUserAndOrganization } from 'src/app/store/user-store/selectors';
import { extractRoute } from '../helpers/guard-url.helper';

@Injectable({ providedIn: 'root' })
export class StartupGuardService {
  constructor(private store: Store, private urlSerializer: UrlSerializer) {}

  canActivate(state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    // Extract the route from the URL
    const fullUrl = (state as any)._routerState.url;
    const returnUrl = extractRoute(this.urlSerializer, fullUrl);

    // Dispatch user authentication and wait for user organization to have been checked
    this.store.dispatch(UserActions.authenticate(returnUrl));

    return this.store.select(selectHasCheckedUserAndOrganization).pipe(first((checked) => checked));
  }
}
