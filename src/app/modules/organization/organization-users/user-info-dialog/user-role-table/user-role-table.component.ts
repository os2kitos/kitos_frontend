import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
  @Input() user!: ODataOrganizationUser;
  @Input() entityType!: RegistrationEntityTypes;
  @Input() hasModifyPermission$!: Observable<boolean | undefined>;

  constructor(private store: Store, private confirmService: ConfirmActionService) {}

  public getUserRights(): Right[] {
    return getRights(this.user, this.entityType);
  }

  public getTitle(): string {
    return getTypeTitleNameByType(this.entityType);
  }

  public getRoleTypeName(): string {
    return getRoleTypeNameByEntityType(this.entityType);
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
