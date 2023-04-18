import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { first, Observable } from 'rxjs';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectHasCheckedUserAndOrganization } from 'src/app/store/user-store/selectors';

@Injectable({ providedIn: 'root' })
export class StartupGuardService {
  constructor(private store: Store) {}

  canActivate(): Observable<boolean | UrlTree> {
    // Dispatch user authentication and wait for user organization to have been checked
    this.store.dispatch(UserActions.authenticate());

    return this.store.select(selectHasCheckedUserAndOrganization).pipe(first((checked) => checked));
  }
}
