import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogService } from '@progress/kendo-angular-dialog';
import { UserActions } from 'src/app/store/user-store/actions';
import { selectHasMultipleOrganizations, selectOrganizationName, selectUser } from 'src/app/store/user-store/selectors';
import { AppPath } from '../../../shared/enums/app-path';
import { ChooseOrganizationComponent } from '../choose-organization/choose-organization.component';

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

  constructor(private store: Store, private dialogService: DialogService) {}

  public showOrganizationDialog() {
    this.dialogService.open({ content: ChooseOrganizationComponent });
  }

  public logout() {
    this.store.dispatch(UserActions.logout());
  }
}
