import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { APICopyRightRequestDTO, APICopyUserRightsRequestDTO } from 'src/app/api/v2';
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
export class CopyRolesDialogComponent {
  @Input() user!: OrganizationUser;

  constructor(private store: Store, private selectionService: RoleSelectionService) {}

  public users: Observable<OrganizationUser[]> = this.store.select(selectAll);
  public selectedUser: OrganizationUser | undefined = undefined;

  public selectedUserChanged(user: OrganizationUser): void {
    this.selectedUser = user;
  }

  public getSelectedUserRights(): Right[] {
    return this.selectionService.getSelectedItems();
  }

  public getButtonText(): string {
    return $localize`Kopier valgte roller ${this.buttonNumberText()}`;
  }

  public onCopyRoles(): void {
    const selectedUser = this.selectedUser;
    if (!selectedUser) return;
    const request = this.getRequest();
    this.store.dispatch(OrganizationUserActions.copyRoles(this.user.Uuid, selectedUser.Uuid, request));
  }

  private getRequest(): APICopyUserRightsRequestDTO {
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

  private getRequestForType(entityType: RegistrationEntityTypes): APICopyRightRequestDTO[] {
    return this.selectionService.getSelectedItemsOfType(entityType).map(this.roleToCopyRoleRequestDTO);
  }

  private roleToCopyRoleRequestDTO(role: Right): APICopyRightRequestDTO {
    return { userUuid: this.user.Uuid, roleId: role.role.id, entityUuid: role.entity.uuid };
  }
}
