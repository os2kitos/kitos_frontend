import { APIMutateRightRequestDTO, APIMutateUserRightsRequestDTO } from 'src/app/api/v2';
import { RoleSelectionService } from 'src/app/shared/services/role-selector-service';
import { roleToCopyRoleRequestDTO } from '../helpers/user-role.helpers';
import { OrganizationUser, Right } from '../models/organization/organization-user/organization-user.model';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';
import { BaseComponent } from './base.component';

export abstract class RoleSelectionBaseComponent extends BaseComponent {

  constructor(protected selectionService: RoleSelectionService) {
    super();
  }

  public getSelectedUserRights(): Right[] {
    return this.selectionService.getSelectedItems();
  }

  public selectAll(user: OrganizationUser): void {
    this.selectionService.selectAll(user);
  }

  public deselectAll(): void {
    this.selectionService.deselectAll();
  }

  public isAllSelected(user: OrganizationUser): boolean {
    return this.selectionService.isAllSelected(user);
  }

  public isAnySelected(): boolean {
    return this.getSelectedUserRights().length > 0;
  }

  public searchFn(search: string, user: OrganizationUser): boolean {
    return user.Name.toLowerCase().includes(search.toLowerCase());
  }

  protected getRequest(user: OrganizationUser): APIMutateUserRightsRequestDTO {
    const request = {
      unitRights: this.getRequestForType(user, 'organization-unit'),
      systemRights: this.getRequestForType(user, 'it-system'),
      contractRights: this.getRequestForType(user, 'it-contract'),
      dataProcessingRights: this.getRequestForType(user, 'data-processing-registration'),
    };
    return request;
  }

  private getRequestForType(user: OrganizationUser, entityType: RegistrationEntityTypes): APIMutateRightRequestDTO[] {
    return this.selectionService
      .getSelectedItemsOfType(entityType)
      .map((right) => roleToCopyRoleRequestDTO(user, right));
  }
}
