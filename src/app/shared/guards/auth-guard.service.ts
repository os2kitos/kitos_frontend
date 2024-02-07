import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectUser } from 'src/app/store/user-store/selectors';
import { AppPath } from '../enums/app-path';

@Injectable({ providedIn: 'root' })
export class AuthGuardService  {
  constructor(private router: Router, private store: Store) {}

  canActivate(): Observable<boolean | UrlTree> {
    // Active if user is present otherwise navigate to root
    return this.store.select(selectUser).pipe(
      map((user) => {
        if (user) {
          return true;
        } else {
          return this.router.parseUrl(AppPath.root);
        }
      })
    );
  }
}
