import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '@progress/kendo-angular-dialog';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectOrganizationName, selectUser } from 'src/app/store/user-store/selectors';
import { AppPath } from '../../../shared/enums/app-path';
import { ChooseOrganizationComponent } from '../choose-organization/choose-organization.component';
import { NavMenuItem } from './nav-menu-item.model';

@Component({
  selector: 'app-nav-bar',
  templateUrl: 'nav-bar.component.html',
  styleUrls: ['nav-bar.component.scss'],
})
export class NavBarComponent {
  public readonly AppPath = AppPath;

  public user$ = this.store.select(selectUser);
  public organizationName$ = this.store.select(selectOrganizationName);

  public navItems: NavMenuItem[] = [
    {
      text: $localize`Organisation`,
      path: AppPath.organisation,
    },
    {
      text: $localize`IT systemer`,
      path: AppPath.itSystems,
      items: [
        {
          text: $localize`IT systemer`,
          path: AppPath.itSystems,
          icon: 'table',
        },
        {
          text: $localize`IT systemkatalog`,
          path: AppPath.itSystems,
          icon: 'table',
        },
        {
          text: $localize`Snitfladekatalog`,
          path: AppPath.itSystems,
          icon: 'table',
        },
      ],
    },
    {
      text: $localize`IT kontrakter`,
      path: AppPath.itContracts,
    },
    {
      text: $localize`Databehandling`,
      path: AppPath.dataProcessing,
    },
  ];

  constructor(private router: Router, private store: Store, private dialogService: DialogService) {}

  public navigate(appPath: AppPath) {
    this.router.navigate([appPath]);
  }

  public showOrganizationDialog() {
    this.dialogService.open({ content: ChooseOrganizationComponent });
  }

  public logout() {
    this.store.dispatch(UserActions.logout());
  }
}
