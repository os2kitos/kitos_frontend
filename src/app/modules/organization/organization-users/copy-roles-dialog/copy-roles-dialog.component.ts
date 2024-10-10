import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { RoleSelectionBaseComponent } from 'src/app/shared/base/base-role-selection.component';
import { DropdownComponent } from 'src/app/shared/components/dropdowns/dropdown/dropdown.component';
import { userHasAnyRights } from 'src/app/shared/helpers/user-role.helpers';
import { OrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { RoleSelectionService } from 'src/app/shared/services/role-selector-service';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { selectAll } from 'src/app/store/organization/organization-user/selectors';

@Component({
  selector: 'app-copy-roles-dialog',
  templateUrl: './copy-roles-dialog.component.html',
  styleUrl: './copy-roles-dialog.component.scss',
  providers: [RoleSelectionService],
})
export class CopyRolesDialogComponent extends RoleSelectionBaseComponent implements OnInit {
  @Input() user!: OrganizationUser;
  @ViewChild(DropdownComponent) dropdownComponent!: DropdownComponent<OrganizationUser>;

  constructor(private store: Store, selectionService: RoleSelectionService, actions$: Actions) {
    super(selectionService, actions$, ofType(OrganizationUserActions.copyRolesError, OrganizationUserActions.copyRolesSuccess));
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.copyRolesSuccess)).subscribe(() => {
        this.selectionService.deselectAll();
        this.dropdownComponent.clear();
        this.selectedUser = undefined;
      })
    );
  }

  public readonly users$: Observable<OrganizationUser[]> = this.store
    .select(selectAll)
    .pipe(map((users) => users.filter((user) => user.Uuid !== this.user.Uuid)));
  public selectedUser: OrganizationUser | undefined = undefined;

  public selectedUserChanged(user: OrganizationUser | undefined | null): void {
    this.selectedUser = user ?? undefined;
  }

  public getSnackbarText(): string {
    return $localize`Vælg handling for valgte roller ${this.buttonNumberText()}`;
  }

  public onCopyRoles(): void {
    const selectedUser = this.selectedUser;
    if (!selectedUser) return;
    const request = this.getRequest(this.user);
    this.isLoading = true;
    this.store.dispatch(OrganizationUserActions.copyRoles(this.user.Uuid, selectedUser.Uuid, request));
  }

  public isUserSelected(): boolean {
    return (
      this.selectedUser !== undefined &&
      this.dropdownComponent.value !== null &&
      this.dropdownComponent.value !== undefined
    );
  }

  public userHasAnyRight(): boolean {
    return userHasAnyRights(this.user);
  }

  private buttonNumberText(): string {
    const noOfSelectedRights = this.getSelectedUserRights().length;
    return noOfSelectedRights > 0 ? `(${noOfSelectedRights})` : '';
  }
}
