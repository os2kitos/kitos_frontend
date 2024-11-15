import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiUsersOrganizationsDialogComponent } from './api-users-organizations-dialog/api-users-organizations-dialog.component';
import { GlobalAdminOtherApiUsersComponentStore } from './global-admin-other-api-users.component-store';

@Component({
  selector: 'app-global-admin-other-api-users',
  templateUrl: './global-admin-other-api-users.component.html',
  styleUrl: './global-admin-other-api-users.component.scss',
  providers: [GlobalAdminOtherApiUsersComponentStore],
})
export class GlobalAdminOtherApiUsersComponent implements OnInit {
  public usersWithRightsholderAccess$ = this.componentStore.usersWithRightsholderAccess$;
  public isLoadingUsersWithRightsholderAccess$ = this.componentStore.isLoadingUsersWithRightsholderAccess$;

  public usersWithCrossAccess$ = this.componentStore.usersWithCrossOrganizationalAccess$;
  public isLoadingUsersWithCrossAccess$ = this.componentStore.isLoadingUsersWithCrossAccess$;

  constructor(private componentStore: GlobalAdminOtherApiUsersComponentStore, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.componentStore.getUsersWithRightsholderAccess();
    this.componentStore.getUsersWithCrossAccess();
  }

  public showOrganizations(organizationNames?: Array<string>) {
    const dialogRef = this.dialog.open(ApiUsersOrganizationsDialogComponent);
    const instance = dialogRef.componentInstance;
    instance.organizationNames = organizationNames ?? [];
  }
}
