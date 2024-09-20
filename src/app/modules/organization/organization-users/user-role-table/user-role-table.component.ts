import { Component, Input } from '@angular/core';
import { OrganizationUser, Right } from 'src/app/shared/models/organization-user/organization-user.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';

@Component({
  selector: 'app-user-role-table',
  templateUrl: './user-role-table.component.html',
  styleUrl: './user-role-table.component.scss',
})
export class UserRoleTableComponent {
  @Input() user!: OrganizationUser;
  @Input() entityType!: RegistrationEntityTypes;

  public getRights(): Right[] {
    switch (this.entityType) {
      case 'organization-unit':
        return this.user.OrganizationUnitRights;
      case 'it-system':
        return this.user.ItSystemRights;
      case 'it-contract':
        return this.user.ItContractRights;
      case 'data-processing-registration':
        return this.user.DataProcessingRegistrationRights;
      default:
        throw new Error(`This component does not support entity type: ${this.entityType}`);
    }
  }

  public getTitle(): string {
    switch (this.entityType) {
      case 'organization-unit':
        return $localize`Organisationsenhedroller`;
      case 'it-system':
        return $localize`Systemroller`;
      case 'it-contract':
        return $localize`Kontraktroller`;
      case 'data-processing-registration':
        return $localize`Databehandlingsroller`;
      default:
        throw new Error(`This component does not support entity type: ${this.entityType}`);
    }
  }

  public getRoleTypeName(): string {
    switch (this.entityType) {
      case 'organization-unit':
        return $localize`Organisationsenhed`;
      case 'it-system':
        return $localize`It System`;
      case 'it-contract':
        return $localize`It Kontrakt`;
      case 'data-processing-registration':
        return $localize`Databehandling`;
      default:
        throw new Error(`This component does not support entity type: ${this.entityType}`);
    }
  }
}
