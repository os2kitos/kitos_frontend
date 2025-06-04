import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { APINamedEntityWithEnabledStatusDTO } from 'src/app/api/v1';
import { APINamedEntityV2DTO } from 'src/app/api/v2';
import { RegistrationModel } from 'src/app/shared/models/organization/organization-unit/organization-unit-registration.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { RegistrationBaseComponent } from '../registration-base.component';
import { AccordionComponent } from '../../../../../shared/components/accordion/accordion.component';
import { NativeTableComponent } from '../../../../../shared/components/native-table/native-table.component';
import { CheckboxComponent } from '../../../../../shared/components/checkbox/checkbox.component';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { ContentSpaceBetweenComponent } from '../../../../../shared/components/content-space-between/content-space-between.component';
import { DetailsPageLinkComponent } from '../../../../../shared/components/details-page-link/details-page-link.component';
import { IconButtonComponent } from '../../../../../shared/components/buttons/icon-button/icon-button.component';
import { TrashcanIconComponent } from '../../../../../shared/components/icons/trashcan-icon.component';

@Component({
  selector: 'app-registrations-page-details-section',
  templateUrl: './registrations-page-details-section.component.html',
  styleUrl: './registrations-page-details-section.component.scss',
  imports: [
    AccordionComponent,
    NativeTableComponent,
    CheckboxComponent,
    NgFor,
    ContentSpaceBetweenComponent,
    DetailsPageLinkComponent,
    NgIf,
    IconButtonComponent,
    TrashcanIconComponent,
    AsyncPipe,
  ],
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
