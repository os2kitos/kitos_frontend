import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { RoleSelectionBaseComponent } from 'src/app/shared/base/base-role-selection.component';
import { DropdownComponent } from 'src/app/shared/components/dropdowns/dropdown/dropdown.component';
import { userHasAnyRights } from 'src/app/shared/helpers/user-role.helpers';
import { OrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { RoleSelectionService } from 'src/app/shared/services/role-selector-service';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { selectAll } from 'src/app/store/organization/organization-user/selectors';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrl: './delete-user-dialog.component.scss',
  providers: [RoleSelectionService],
})
export class DeleteUserDialogComponent extends RoleSelectionBaseComponent implements OnInit {
  @Input() user$!: Observable<OrganizationUser>;
  @Input() nested: boolean = false;
  @ViewChild(DropdownComponent) dropdownComponent!: DropdownComponent<OrganizationUser>;

  constructor(
    private store: Store,
    selectionService: RoleSelectionService,
    private confirmActionService: ConfirmActionService,
    private dialogRef: MatDialogRef<DeleteUserDialogComponent>,
    actions$: Actions
  ) {
    super(
      selectionService,
      actions$,
      ofType(OrganizationUserActions.transferRolesError, OrganizationUserActions.transferRolesSuccess)
    );
  }

  public readonly organizationName$: Observable<string | undefined> = this.store.select(selectOrganizationName);

  public readonly users$: Observable<OrganizationUser[]> = this.store.select(selectAll).pipe(
    concatLatestFrom(() => this.user$),
    map(([users, user]) => users.filter((u) => u.Uuid !== user.Uuid))
  );
  public selectedUser: OrganizationUser | undefined = undefined;

  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.copyRolesSuccess)).subscribe(() => {
        this.selectionService.deselectAll();
        if (this.dropdownComponent) {
          this.dropdownComponent.clear();
        }
        this.selectedUser = undefined;
      })
    );
  }

  public selectedUserChanged(user: OrganizationUser | undefined | null): void {
    this.selectedUser = user ?? undefined;
  }

  public hasRoles(user: OrganizationUser): boolean {
    return userHasAnyRights(user);
  }

  public onDeleteUser(user: OrganizationUser): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      onConfirm: () => this.deleteUser(user),
      message: $localize`Er du sikker på, at du vil slette brugeren '${this.getUserName(user)}'?`,
    });
  }

  private deleteUser(user: OrganizationUser): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.deleteUserSuccess)).subscribe(() => {
        this.dialogRef.close();
      })
    );
    this.store.dispatch(OrganizationUserActions.deleteUser(user.Uuid));
  }

  public onTransferRoles(user: OrganizationUser): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      onConfirm: () => this.transferRoles(user),
      message: $localize`Er du sikker på, at du vil overføre rollerne?`,
    });
  }

  public isUserSelected(): boolean {
    return (
      this.selectedUser !== undefined &&
      this.dropdownComponent?.value !== null &&
      this.dropdownComponent?.value !== undefined
    );
  }

  private transferRoles(user: OrganizationUser): void {
    const selectedUser = this.selectedUser;
    if (!selectedUser) return;
    const request = this.getRequest(user);
    this.isLoading = true;
    this.store.dispatch(OrganizationUserActions.transferRoles(user.Uuid, selectedUser.Uuid, request));
  }

  public getUserName(user: OrganizationUser): string {
    return `${user.FirstName} ${user.LastName}`;
  }

  public shouldShowContent(user: OrganizationUser): boolean {
    return this.hasRoles(user) && !this.isLoading;
  }
}
