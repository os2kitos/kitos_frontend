import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectUser } from 'src/app/store/user-store/selectors';
import { AppPath } from '../../../shared/enums/app-path';
import { NavMenuItem } from '../nav-menu/nav-menu-item.model';

@Component({
  selector: 'app-nav-bar',
  templateUrl: 'nav-bar.component.html',
  styleUrls: ['nav-bar.component.scss'],
})
export class NavBarComponent {
  readonly AppPath = AppPath;

  public user$ = this.store.select(selectUser);

  public navItems: NavMenuItem[] = [
    {
      text: 'Organisation',
      path: AppPath.organisation,
    },
    {
      text: 'IT systemer',
      path: AppPath.itSystems,
      items: [
        {
          text: 'IT systemer',
          path: AppPath.itSystems,
          icon: 'table',
        },
        {
          text: 'IT systemkatalog',
          path: AppPath.itSystems,
          icon: 'table',
        },
        {
          text: 'Snitfladekatalog',
          path: AppPath.itSystems,
          icon: 'table',
        },
      ],
    },
    {
      text: 'IT kontrakter',
      path: AppPath.itContracts,
    },
    {
      text: 'Databehandling',
      path: AppPath.dataProcessing,
    },
  ];

  constructor(private router: Router, private store: Store) {}

  public navigate(appPath: AppPath) {
    this.router.navigate([appPath]);
  }

  public logout() {
    this.store.dispatch(UserActions.updateUser());
    this.router.navigate([AppPath.root]);
  }
}
