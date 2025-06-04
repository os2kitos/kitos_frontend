import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiUsersOrganizationsDialogComponent } from './api-users-organizations-dialog/api-users-organizations-dialog.component';
import { GlobalAdminOtherApiUsersComponentStore } from './global-admin-other-api-users.component-store';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { NativeTableComponent } from '../../../../shared/components/native-table/native-table.component';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';
import { CheckPositiveGreenIconComponent } from '../../../../shared/components/icons/check-positive-green.component';
import { CheckNegativeGrayIconComponent } from '../../../../shared/components/icons/check-negative-gray.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-states/empty-state.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { IconButtonComponent } from '../../../../shared/components/buttons/icon-button/icon-button.component';
import { EyeIconComponent } from '../../../../shared/components/icons/eye-icon.component';

@Component({
  selector: 'app-global-admin-other-api-users',
  templateUrl: './global-admin-other-api-users.component.html',
  styleUrl: './global-admin-other-api-users.component.scss',
  providers: [GlobalAdminOtherApiUsersComponentStore],
  imports: [
    CardComponent,
    CardHeaderComponent,
    NgIf,
    NativeTableComponent,
    NgFor,
    ParagraphComponent,
    CheckPositiveGreenIconComponent,
    CheckNegativeGrayIconComponent,
    EmptyStateComponent,
    LoadingComponent,
    IconButtonComponent,
    EyeIconComponent,
    AsyncPipe,
  ],
})
export class GlobalAdminOtherApiUsersComponent implements OnInit {
  public usersWithRightsholderAccess$ = this.componentStore.usersWithRightsholderAccess$;
  public isLoadingUsersWithRightsholderAccess$ = this.componentStore.isLoadingUsersWithRightsholderAccess$;

  public usersWithCrossAccess$ = this.componentStore.usersWithCrossOrganizationalAccess$;
  public isLoadingUsersWithCrossAccess$ = this.componentStore.isLoadingUsersWithCrossAccess$;

  constructor(
    private componentStore: GlobalAdminOtherApiUsersComponentStore,
    private dialog: MatDialog,
  ) {}

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
