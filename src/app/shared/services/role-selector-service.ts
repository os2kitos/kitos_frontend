import { Injectable } from '@angular/core';
import { ODataOrganizationUser, Right } from '../models/organization/organization-user/organization-user.model';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';
import { EntitySelectionService } from './entity-selector-service';

@Injectable()
export class RoleSelectionService extends EntitySelectionService<Right, RegistrationEntityTypes> {
  constructor() {
    super();
    this.initSelectedItems(['organization-unit', 'it-system', 'it-contract', 'data-processing-registration']);
  }

  selectAll(user: ODataOrganizationUser): void {
    this.selectAllOfType('organization-unit', user.OrganizationUnitRights);
    this.selectAllOfType('it-system', user.ItSystemRights);
    this.selectAllOfType('it-contract', user.ItContractRights);
    this.selectAllOfType('data-processing-registration', user.DataProcessingRegistrationRights);
  }

  isAllSelected(user: ODataOrganizationUser): boolean {
    return (
      this.isAllOfTypeSelected('organization-unit', user.OrganizationUnitRights) &&
      this.isAllOfTypeSelected('it-system', user.ItSystemRights) &&
      this.isAllOfTypeSelected('it-contract', user.ItContractRights) &&
      this.isAllOfTypeSelected('data-processing-registration', user.DataProcessingRegistrationRights)
    );
  }
}
