import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserGuardService } from './user-guard.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  constructor(private userGuardService: UserGuardService) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.userGuardService.verifyAuthorization((_) => true);
  }
}
