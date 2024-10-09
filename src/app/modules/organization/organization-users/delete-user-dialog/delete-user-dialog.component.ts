import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { userHasAnyRights } from 'src/app/shared/helpers/user-role.helpers';
import { OrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';
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
export class DeleteUserDialogComponent extends BaseComponent {
  @Input() user!: OrganizationUser;
  @Input() nested: boolean = false;

  constructor(
    private store: Store,
    private selectionService: RoleSelectionService,
    private confirmActionService: ConfirmActionService,
    private dialogRef: MatDialogRef<DeleteUserDialogComponent>,
    private actions$: Actions,
  ) {
    super();
  }

  public readonly organizationName$: Observable<string | undefined> = this.store.select(selectOrganizationName);

  public hasRoles(): boolean {
    return userHasAnyRights(this.user); //TODO, use this method in copy roles dialog also
  }

  public onDeleteUser(): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      onConfirm: () => this.deleteUser(),
      message: $localize`Er du sikker på, at du vil slette brugeren '${this.getUserName()}'?`,
    });
  }

  private deleteUser(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.deleteUserSuccess)).subscribe(() => {
        this.dialogRef.close();
      })
    );
    this.store.dispatch(OrganizationUserActions.deleteUser(this.user.Uuid));
  }

  public onTransferRoles(): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      onConfirm: () => this.transferRoles(),
      message: $localize`Er du sikker på, at du vil overføre rollerne?`,
    });
  }

  private transferRoles(): void {

  }

  public getUserName(): string {
    return `${this.user.FirstName} ${this.user.LastName}`;
  }
}
