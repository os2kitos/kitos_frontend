import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { RoleSelectionBaseComponent } from 'src/app/shared/base/base-role-selection.component';
import { userHasAnyRights } from 'src/app/shared/helpers/user-role.helpers';
import { ODataOrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { ShallowUser } from 'src/app/shared/models/userV2.model';
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

  public formGroup = new FormGroup({
    user: new FormControl<ShallowUser | undefined>(undefined, Validators.required),
  });

  public readonly organizationName$: Observable<string | undefined> = this.store.select(selectOrganizationName);

  public disabledUuids$!: Observable<string[]>;

  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.transferRolesSuccess)).subscribe(() => {
        this.selectionService.deselectAll();
        this.formGroup.reset();
      })
    );

    this.disabledUuids$ = this.user$.pipe(map((user) => [user.Uuid]));
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

  private transferRoles(user: ODataOrganizationUser): void {
    const selectedUserUuid = this.formGroup.value.user?.uuid;
    if (!selectedUserUuid) return;
    const request = this.getRequest(user);
    this.isLoading = true;
    this.store.dispatch(OrganizationUserActions.transferRoles(user.Uuid, selectedUserUuid, request));
  }

  public getUserName(user: ODataOrganizationUser): string {
    return `${user.FirstName} ${user.LastName}`;
  }

  public shouldShowContent(user: ODataOrganizationUser): boolean {
    return this.hasRoles(user) && !this.isLoading;
  }
}
