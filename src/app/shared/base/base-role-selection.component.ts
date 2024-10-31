import { Actions } from '@ngrx/effects';
import { APIMutateRightRequestDTO, APIMutateUserRightsRequestDTO } from 'src/app/api/v2';
import { RoleSelectionService } from 'src/app/shared/services/role-selector-service';
import { roleToCopyRoleRequestDTO } from '../helpers/user-role.helpers';
import { ODataOrganizationUser, Right } from '../models/organization/organization-user/organization-user.model';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';
import { BaseComponent } from './base.component';

export abstract class RoleSelectionBaseComponent extends BaseComponent {
  protected isLoading = false;

  constructor(
    protected selectionService: RoleSelectionService,
    protected actions$: Actions,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private loadingDoneActions: any
  ) {
    super();
    this.actions$.pipe(this.loadingDoneActions).subscribe(() => {
      this.isLoading = false;
    });
  }

  public getSelectedUserRights(): Right[] {
    return this.selectionService.getSelectedItems();
  }

  public selectAll(user: ODataOrganizationUser): void {
    this.selectionService.selectAll(user);
  }

  public deselectAll(): void {
    this.selectionService.deselectAll();
  }

  public isAllSelected(user: ODataOrganizationUser): boolean {
    return this.selectionService.isAllSelected(user);
  }

  public isAnySelected(): boolean {
    return this.getSelectedUserRights().length > 0;
  }

  protected getRequest(user: ODataOrganizationUser): APIMutateUserRightsRequestDTO {
    const request = {
      unitRights: this.getRequestForType(user, 'organization-unit'),
      systemRights: this.getRequestForType(user, 'it-system'),
      contractRights: this.getRequestForType(user, 'it-contract'),
      dataProcessingRights: this.getRequestForType(user, 'data-processing-registration'),
    };
    return request;
  }

  private getRequestForType(
    user: ODataOrganizationUser,
    entityType: RegistrationEntityTypes
  ): APIMutateRightRequestDTO[] {
    return this.selectionService
      .getSelectedItemsOfType(entityType)
      .map((right) => roleToCopyRoleRequestDTO(user, right));
  }
}
