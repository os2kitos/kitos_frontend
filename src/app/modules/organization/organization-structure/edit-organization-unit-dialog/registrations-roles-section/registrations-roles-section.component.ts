import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { APINamedEntityWithUserFullNameV2DTO } from 'src/app/api/v2';
import { RegistrationModel } from 'src/app/shared/models/organization/organization-unit/organization-unit-registration.model';
import { RegistrationBaseComponent } from '../registration-base.component';
import { AccordionComponent } from '../../../../../shared/components/accordion/accordion.component';
import { NativeTableComponent } from '../../../../../shared/components/native-table/native-table.component';
import { CheckboxComponent } from '../../../../../shared/components/checkbox/checkbox.component';
import { NgFor, AsyncPipe } from '@angular/common';
import { ParagraphComponent } from '../../../../../shared/components/paragraph/paragraph.component';
import { ContentSpaceBetweenComponent } from '../../../../../shared/components/content-space-between/content-space-between.component';
import { IconButtonComponent } from '../../../../../shared/components/buttons/icon-button/icon-button.component';
import { TrashcanIconComponent } from '../../../../../shared/components/icons/trashcan-icon.component';

@Component({
  selector: 'app-registrations-roles-section',
  templateUrl: './registrations-roles-section.component.html',
  styleUrl: './registrations-roles-section.component.scss',
  imports: [
    AccordionComponent,
    NativeTableComponent,
    CheckboxComponent,
    NgFor,
    ParagraphComponent,
    ContentSpaceBetweenComponent,
    IconButtonComponent,
    TrashcanIconComponent,
    AsyncPipe,
  ],
})
export class RegistrationsRolesSectionComponent extends RegistrationBaseComponent<APINamedEntityWithUserFullNameV2DTO> {
  @Input() public roleRegistrations$!: Observable<Array<RegistrationModel<APINamedEntityWithUserFullNameV2DTO>>>;
}
