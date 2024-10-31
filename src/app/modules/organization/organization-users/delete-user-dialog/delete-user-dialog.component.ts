import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, first, map, Observable } from 'rxjs';
import { RoleSelectionBaseComponent } from 'src/app/shared/base/base-role-selection.component';
import { userHasAnyRights } from 'src/app/shared/helpers/user-role.helpers';
import { OrganizationUserV2 } from 'src/app/shared/models/organization/organization-user/organization-user-v2.model';
import { ODataOrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { RoleSelectionService } from 'src/app/shared/services/role-selector-service';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { selectOrganizationName } from 'src/app/store/user-store/selectors';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrl: './delete-user-dialog.component.scss',
  providers: [RoleSelectionService],
})
export class DeleteUserDialogComponent extends RoleSelectionBaseComponent implements OnInit {
  @Input() user$!: Observable<ODataOrganizationUser>;
  @Input() nested: boolean = false;

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

  public disabledUuids$!: Observable<string[]>;

  public selectedUser$: BehaviorSubject<OrganizationUserV2 | undefined> = new BehaviorSubject<
    OrganizationUserV2 | undefined
  >(undefined);

  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.transferRolesSuccess)).subscribe(() => {
        this.selectionService.deselectAll();
        this.selectedUser$.next(undefined);
      })
    );

    this.disabledUuids$ = this.user$.pipe(map((user) => [user.Uuid]));
  }

  public selectedUserChanged(user: OrganizationUserV2 | undefined | null): void {
    this.selectedUser$.next(user ?? undefined);
  }

  public hasRoles(user: ODataOrganizationUser): boolean {
    return userHasAnyRights(user);
  }

  public onDeleteUser(user: ODataOrganizationUser): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      onConfirm: () => this.deleteUser(user),
      message: $localize`Er du sikker på, at du vil slette brugeren '${this.getUserName(user)}'?`,
    });
  }

  private deleteUser(user: ODataOrganizationUser): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.deleteUserSuccess)).subscribe(() => {
        this.dialogRef.close();
      })
    );
    this.store.dispatch(OrganizationUserActions.deleteUser(user.Uuid));
  }

  public onTransferRoles(user: ODataOrganizationUser): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      onConfirm: () => this.transferRoles(user),
      message: $localize`Er du sikker på, at du vil overføre rollerne?`,
    });
  }

  public isUserSelected(): Observable<boolean> {
    return this.selectedUser$.pipe(map((user) => user !== undefined));
  }

  private transferRoles(user: ODataOrganizationUser): void {
    this.selectedUser$.pipe(first()).subscribe((selectedUser) => {
      if (!selectedUser) return;
      const request = this.getRequest(user);
      this.isLoading = true;
      this.store.dispatch(OrganizationUserActions.transferRoles(user.Uuid, selectedUser.uuid, request));
    });
  }

  public getUserName(user: ODataOrganizationUser): string {
    return `${user.FirstName} ${user.LastName}`;
  }

  public shouldShowContent(user: ODataOrganizationUser): boolean {
    return this.hasRoles(user) && !this.isLoading;
  }
}
