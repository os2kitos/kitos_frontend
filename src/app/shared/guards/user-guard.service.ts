import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectUser } from 'src/app/store/user-store/selectors';
import { AppPath } from '../enums/app-path';

@Injectable({ providedIn: 'root' })
export class UserGuardService implements CanActivate {
  constructor(private router: Router, private store: Store, private location: Location) {}

  canActivate(): Observable<boolean | UrlTree> {
    // If the application is inside an iframe it should not load
    if (window.self !== window.top) {
      return of(true);
    }

    // Go to root if no user is present
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
