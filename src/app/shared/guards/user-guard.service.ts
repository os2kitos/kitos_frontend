import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { selectUser } from 'src/app/store/user-store/selectors';
import { AppPath } from '../enums/app-path';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserGuardService {
  constructor(private router: Router, private store: Store) {}

  public verifyAuthorization(shouldUserBeAuthorized: (user: User) => boolean): Observable<boolean | UrlTree> {
    return this.store.select(selectUser).pipe(
      map((user) => {
        if (user && shouldUserBeAuthorized(user)) {
          return true;
        } else {
          // Redirect unauthorized users
          return this.router.parseUrl(AppPath.root + '');
        }
      })
    );
  }
}
