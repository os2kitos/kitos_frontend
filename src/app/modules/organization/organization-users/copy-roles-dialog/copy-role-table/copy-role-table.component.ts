import { Component, Input } from '@angular/core';
import { getRights, getRoleTypeNameByEntityType } from 'src/app/shared/helpers/user-role.helpers';
import { OrganizationUser, Right } from 'src/app/shared/models/organization-user/organization-user.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';

@Component({
  selector: 'app-copy-role-table',
  templateUrl: './copy-role-table.component.html',
  styleUrl: './copy-role-table.component.scss',
})
export class CopyRoleTableComponent {
  @Input() user!: OrganizationUser;
  @Input() entityType!: RegistrationEntityTypes;

  public getUserRights(): Right[] {
    return getRights(this.user, this.entityType);
  }

  public getRoleTypeName(): string {
    return getRoleTypeNameByEntityType(this.entityType);
  }

  public isRightSelected(right: Right): boolean {
    return false;
  }

  public getUserName(): string {
    return this.user.Name;
  }
}
