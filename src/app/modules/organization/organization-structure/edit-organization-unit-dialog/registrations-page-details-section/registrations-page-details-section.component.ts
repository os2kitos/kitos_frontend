import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { APINamedEntityWithEnabledStatusDTO } from 'src/app/api/v1';
import { APINamedEntityV2DTO } from 'src/app/api/v2';
import { RegistrationModel } from 'src/app/shared/models/organization/organization-unit/organization-unit-registration.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { RegistrationBaseComponent } from '../registration-base.component';

@Component({
  selector: 'app-registrations-page-details-section',
  templateUrl: './registrations-page-details-section.component.html',
  styleUrl: './registrations-page-details-section.component.scss',
})
export class RegistrationsPageDetailsSectionComponent extends RegistrationBaseComponent<APINamedEntityWithEnabledStatusDTO> {
  @Input() public registrations$!: Observable<Array<RegistrationModel<APINamedEntityV2DTO>>>;
  @Input() public entityType!: RegistrationEntityTypes;
  @Input() public subpagePath?: string;

  @Output() public navigateToDetailsPage = new EventEmitter<void>();

  public navigateToDetailsPageClick(): void {
    this.navigateToDetailsPage.emit();
  }
}
