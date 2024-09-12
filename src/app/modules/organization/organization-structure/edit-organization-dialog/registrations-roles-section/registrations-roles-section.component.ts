import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { APINamedEntityWithUserFullNameV2DTO } from 'src/app/api/v2';
import { RegistrationModel } from 'src/app/shared/models/organization-unit/organization-unit-registration.model';
import { RegistrationBaseComponent } from '../registration-base.component';

@Component({
  selector: 'app-registrations-roles-section',
  templateUrl: './registrations-roles-section.component.html',
  styleUrl: './registrations-roles-section.component.scss',
})
export class RegistrationsRolesSectionComponent extends RegistrationBaseComponent<APINamedEntityWithUserFullNameV2DTO> {
  @Input() public roleRegistrations$!: Observable<Array<RegistrationModel<APINamedEntityWithUserFullNameV2DTO>>>;
}
