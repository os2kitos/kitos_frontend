import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, switchMap } from 'rxjs';
import { selectUserIsCurrentlyLocalAdmin } from 'src/app/store/user-store/selectors';
import { UserGuardService } from './user-guard.service';

@Injectable({ providedIn: 'root' })
export class LocalAdminGuardService {
  constructor(private userGuardService: UserGuardService, private store: Store) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.store
      .select(selectUserIsCurrentlyLocalAdmin)
      .pipe(
        switchMap((isCurrentyLocalAdmin) => this.userGuardService.verifyAuthorization((_) => isCurrentyLocalAdmin))
      );
  }
}
