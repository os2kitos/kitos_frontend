import { Component } from '@angular/core';
import { APINamedEntityWithUserFullNameV2DTO } from 'src/app/api/v2';
import { RegistrationModel } from 'src/app/shared/models/organization-unit/organization-unit-registration.model';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import { selectOrganizationUnitRightsRegistrations } from 'src/app/store/organization-unit/selectors';
import { RegistrationBaseComponent } from '../registration-base.component';

@Component({
  selector: 'app-registrations-roles-section',
  templateUrl: './registrations-roles-section.component.html',
  styleUrl: './registrations-roles-section.component.scss',
})
export class RegistrationsRolesSectionComponent extends RegistrationBaseComponent {
  public readonly roleRegistrations$ = this.store.select(selectOrganizationUnitRightsRegistrations);
  public readonly registrationType = 'unitRights';

  public changeSelectRegistrationState(registration: RegistrationModel<APINamedEntityWithUserFullNameV2DTO>) {
    registration.isSelected = !registration.isSelected;
    this.store.dispatch(OrganizationUnitActions.changeOrganizationUnitRegistrationSelect(registration));
  }

  public removeSingleRegistration(regId: number | undefined) {
    if (!regId) return;
    this.removeRegistration({ organizationUnitRights: [regId] });
  }
}
