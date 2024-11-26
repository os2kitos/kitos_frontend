import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { UserGuardService } from './user-guard.service';
import { selectUserIsCurrentlyLocalAdmin } from 'src/app/store/user-store/selectors';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class LocalAdminGuardService implements CanActivate {
  constructor(private userGuardService: UserGuardService, private store: Store) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.store
      .select(selectUserIsCurrentlyLocalAdmin)
      .pipe(
        switchMap((isCurrentyLocalAdmin) => this.userGuardService.verifyAuthorization((_) => isCurrentyLocalAdmin))
      );
  }
}
