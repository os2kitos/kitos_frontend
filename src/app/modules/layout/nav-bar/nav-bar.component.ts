import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectHasMultipleOrganizations, selectOrganizationName, selectUser } from 'src/app/store/user-store/selectors';
import { AppPath } from '../../../shared/enums/app-path';
import { ChooseOrganizationComponent } from '../choose-organization/choose-organization.component';
import { selectUIRootConfig } from 'src/app/store/organization/selectors';

@Component({
  selector: 'app-nav-bar',
  templateUrl: 'nav-bar.component.html',
  styleUrls: ['nav-bar.component.scss'],
})
export class NavBarComponent {
  public readonly AppPath = AppPath;

  public readonly user$ = this.store.select(selectUser);
  public readonly organizationName$ = this.store.select(selectOrganizationName);
  public readonly hasMultipleOrganizations$ = this.store.select(selectHasMultipleOrganizations);
  public readonly uiRootConfig$ = this.store.select(selectUIRootConfig);

  constructor(private store: Store, private dialog: MatDialog) {}

  public showOrganizationDialog() {
    this.dialog.open(ChooseOrganizationComponent);
  }

  public logout() {
    this.store.dispatch(UserActions.logout());
  }
}
