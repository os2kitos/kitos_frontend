import { Component, Input } from '@angular/core';
import {
  getRights,
  getRoleTypeNameByEntityType,
  getTypeTitleNameByType,
} from 'src/app/shared/helpers/user-role.helpers';
import {
  ODataOrganizationUser,
  Right,
} from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { RoleSelectionService } from 'src/app/shared/services/role-selector-service';

@Component({
  selector: 'app-manage-user-role-table',
  templateUrl: './manage-user-role-table.component.html',
  styleUrl: './manage-user-role-table.component.scss',
})
export class ManageUserRoleTableComponent {
  @Input() user!: ODataOrganizationUser;
  @Input() entityType!: RegistrationEntityTypes;

  constructor(private selectionService: RoleSelectionService) {}

  public getUserRights(): Right[] {
    return getRights(this.user, this.entityType);
  }

  public getUserName(): string {
    return this.user.Name;
  }

  public getRoleTypeName(): string {
    return getRoleTypeNameByEntityType(this.entityType);
  }

  public isRightSelected(right: Right): boolean {
    return this.selectionService.isItemSelected(this.entityType, right);
  }

  public roleSelectionChanged(right: Right, value: boolean | undefined): void {
    if (value) {
      this.selectionService.selectItem(this.entityType, right);
    } else {
      this.selectionService.deselectItem(this.entityType, right);
    }
  }

  public allRoleSelectedChanged(value: boolean | undefined): void {
    if (value) {
      this.selectionService.selectAllOfType(this.entityType, this.getUserRights());
    } else {
      this.selectionService.deselectAllOfType(this.entityType);
    }
  }

  public isAllSelected(): boolean {
    return this.selectionService.isAllOfTypeSelected(this.entityType, this.getUserRights());
  }

  public getTitle(): string {
    return getTypeTitleNameByType(this.entityType);
  }
}
