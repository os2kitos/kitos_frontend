import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { APIMutateRightRequestDTO, APIMutateUserRightsRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { DropdownComponent } from 'src/app/shared/components/dropdowns/dropdown/dropdown.component';
import { userHasAnyRights } from 'src/app/shared/helpers/user-role.helpers';
import { OrganizationUser, Right } from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { RoleSelectionService } from 'src/app/shared/services/role-selector-service';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { selectAll } from 'src/app/store/organization/organization-user/selectors';

@Component({
  selector: 'app-copy-roles-dialog',
  templateUrl: './copy-roles-dialog.component.html',
  styleUrl: './copy-roles-dialog.component.scss',
  providers: [RoleSelectionService],
})
export class CopyRolesDialogComponent extends BaseComponent implements OnInit {
  @Input() user!: OrganizationUser;
  @ViewChild(DropdownComponent) dropdownComponent!: DropdownComponent<OrganizationUser>;

  public isLoading = false;

  constructor(private store: Store, private selectionService: RoleSelectionService, private actions$: Actions) {
    super();
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.copyRolesSuccess)).subscribe(() => {
        this.selectionService.deselectAll();
        this.dropdownComponent.clear();
        this.selectedUser = undefined;
      })
    );

    this.actions$
      .pipe(ofType(OrganizationUserActions.copyRolesError, OrganizationUserActions.copyRolesSuccess))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  public readonly users: Observable<OrganizationUser[]> = this.store
    .select(selectAll)
    .pipe(map((users) => users.filter((user) => user.Uuid !== this.user.Uuid)));
  public selectedUser: OrganizationUser | undefined = undefined;

  public selectedUserChanged(user: OrganizationUser | undefined | null): void {
    this.selectedUser = user ?? undefined;
  }

  public getSelectedUserRights(): Right[] {
    return this.selectionService.getSelectedItems();
  }

  public getSnackbarText(): string {
    return $localize`Vælg handling for valgte roller ${this.buttonNumberText()}`;
  }

  public onCopyRoles(): void {
    const selectedUser = this.selectedUser;
    if (!selectedUser) return;
    const request = this.getRequest();
    this.isLoading = true;
    this.store.dispatch(OrganizationUserActions.copyRoles(this.user.Uuid, selectedUser.Uuid, request));
  }

  public selectAll(): void {
    this.selectionService.selectAll(this.user);
  }

  public deselectAll(): void {
    this.selectionService.deselectAll();
  }

  public isAllSelected(): boolean {
    return this.selectionService.isAllSelected(this.user);
  }

  public isAnySelected(): boolean {
    return this.getSelectedUserRights().length > 0;
  }

  public isUserSelected(): boolean {
    return (
      this.selectedUser !== undefined &&
      this.dropdownComponent.value !== null &&
      this.dropdownComponent.value !== undefined
    );
  }

  public searchFn(search: string, user: OrganizationUser): boolean {
    return user.Name.toLowerCase().includes(search.toLowerCase());
  }

  public userHasAnyRight(): boolean {
    return userHasAnyRights(this.user);
  }

  private getRequest(): APIMutateUserRightsRequestDTO {
    const request = {
      unitRights: this.getRequestForType('organization-unit'),
      systemRights: this.getRequestForType('it-system'),
      contractRights: this.getRequestForType('it-contract'),
      dataProcessingRights: this.getRequestForType('data-processing-registration'),
    };
    return request;
  }

  private buttonNumberText(): string {
    const noOfSelectedRights = this.getSelectedUserRights().length;
    return noOfSelectedRights > 0 ? `(${noOfSelectedRights})` : '';
  }

  private getRequestForType(entityType: RegistrationEntityTypes): APIMutateRightRequestDTO[] {
    return this.selectionService
      .getSelectedItemsOfType(entityType)
      .map((right) => this.roleToCopyRoleRequestDTO(right));
  }

  private roleToCopyRoleRequestDTO(role: Right): APIMutateRightRequestDTO {
    return { userUuid: this.user.Uuid, roleId: role.role.id, entityUuid: role.entity.uuid };
  }
}
