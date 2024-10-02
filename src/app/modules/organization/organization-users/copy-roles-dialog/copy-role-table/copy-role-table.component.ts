import { Component, Input } from '@angular/core';
import { getRights, getRoleTypeNameByEntityType } from 'src/app/shared/helpers/user-role.helpers';
import { OrganizationUser, Right } from 'src/app/shared/models/organization-user/organization-user.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { RoleSelectionService } from 'src/app/shared/services/role-selector-service';

@Component({
  selector: 'app-copy-role-table',
  templateUrl: './copy-role-table.component.html',
  styleUrl: './copy-role-table.component.scss',
})
export class CopyRoleTableComponent {
  @Input() user!: OrganizationUser;
  @Input() entityType!: RegistrationEntityTypes;

  constructor(private selectionService: RoleSelectionService) {}

  public getUserRights(): Right[] {
    return getRights(this.user, this.entityType);
  }

  public getRoleTypeName(): string {
    return getRoleTypeNameByEntityType(this.entityType);
  }

  public isRightSelected(_: Right): boolean {
    return this.selectionService.isRightSelected(this.user, _);
  }

  public roleSelectionChanged(_: Right, value: boolean | undefined): void {

  }

  public allRoleSelectedChanged(value: boolean | undefined): void {

  }

  public getUserName(): string {
    return this.user.Name;
  }
}
