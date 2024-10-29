import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, tap } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { selectUIRootConfig } from 'src/app/store/organization/selectors';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectHasMultipleOrganizations, selectHasTriedAuthenticating, selectIsAuthenticating, selectOrganizationName, selectUser } from 'src/app/store/user-store/selectors';
import { AppPath } from '../../../shared/enums/app-path';
import { ChooseOrganizationComponent } from '../choose-organization/choose-organization.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: 'nav-bar.component.html',
  styleUrls: ['nav-bar.component.scss'],
})
export class NavBarComponent extends BaseComponent implements OnInit {
  public readonly AppPath = AppPath;

  public readonly user$ = this.store.select(selectUser);
  public readonly userHasTriedAuthenticating$ = this.store.select(selectHasTriedAuthenticating);
  public readonly organizationName$ = this.store.select(selectOrganizationName);
  public readonly hasMultipleOrganizations$ = this.store.select(selectHasMultipleOrganizations);
  public readonly uiRootConfig$ = this.store.select(selectUIRootConfig);

  constructor(private store: Store, private dialog: MatDialog, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      combineLatest([this.userHasTriedAuthenticating$, this.router.events]).pipe(
        filter(([userHasTriedAuthenticating, event]) => userHasTriedAuthenticating && event instanceof NavigationEnd),
        tap(() => this.store.dispatch(OrganizationActions.getUIRootConfig()))
      ).subscribe());
  }

  public showOrganizationDialog() {
    this.dialog.open(ChooseOrganizationComponent);
  }

  public logout() {
    this.store.dispatch(UserActions.logout());
  }
}
