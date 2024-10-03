import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OrganizationUser, Right } from 'src/app/shared/models/organization-user/organization-user.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { RoleSelectionService } from 'src/app/shared/services/role-selector-service';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import { selectAll } from 'src/app/store/organization-user/selectors';

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
    this.dispatchAssignUserCopiedRoles('organization-unit');
    this.dispatchAssignUserCopiedRoles('it-system');
    this.dispatchAssignUserCopiedRoles('it-contract');
    this.dispatchAssignUserCopiedRoles('data-processing-registration');

  }

  private buttonNumberText(): string {
    const noOfSelectedRights = this.getSelectedUserRights().length;
    return noOfSelectedRights > 0 ? `(${noOfSelectedRights})` : '';
  }

  private dispatchAssignUserCopiedRoles(entityType: RegistrationEntityTypes): void {
    const rights = this.selectionService.getSelectedItemsOfType(entityType);
    const action = this.getAssignUserRightsAction(entityType);
    //TODO

  }

  private getAssignUserRightsAction(entityType: RegistrationEntityTypes) {
    switch (entityType) {
      case 'organization-unit':
        return OrganizationUnitActions.addOrganizationUnitRole;
      default:
        throw new Error(`Unsupported function for entity type: ${entityType}`);
    }
  }
}
