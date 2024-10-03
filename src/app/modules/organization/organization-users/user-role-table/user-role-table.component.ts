import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OrganizationUser, Right } from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { OrganizationUnitActions } from 'src/app/store/organization/organization-unit/actions';

@Component({
  selector: 'app-user-role-table',
  templateUrl: './user-role-table.component.html',
  styleUrl: './user-role-table.component.scss',
})
export class UserRoleTableComponent {
  @Input() user!: OrganizationUser;
  @Input() entityType!: RegistrationEntityTypes;
  @Input() hasModifyPermission$!: Observable<boolean | undefined>;

  constructor(private store: Store, private confirmService: ConfirmActionService) {}

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

  public onRemove(right: Right): void {
    this.confirmService.confirmAction({
      title: $localize`Fjern rolle`,
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på, at du vil fjerne rollen?`,
      onConfirm: () => this.removeHandler(right),
    });
  }

  private removeHandler(right: Right): void {
    const action = this.getDeleteEntityRoleAction();
    const actionWithPayload = action(this.user.Uuid, right.role.uuid, right.entity.uuid);
    this.store.dispatch(actionWithPayload);
  }

  private getDeleteEntityRoleAction() {
    switch (this.entityType) {
      case 'organization-unit':
        return OrganizationUnitActions.deleteOrganizationUnitRole;
      case 'it-system':
        return ITSystemUsageActions.removeItSystemUsageRole;
      case 'it-contract':
        return ITContractActions.removeItContractRole;
      case 'data-processing-registration':
        return DataProcessingActions.removeDataProcessingRole;
      default:
        throw new Error(`This component does not support entity type: ${this.entityType}`);
    }
  }
}
