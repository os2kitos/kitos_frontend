import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { APIChangeOrganizationUnitRegistrationV2RequestDTO, APINamedEntityV2DTO } from 'src/app/api/v2';
import { PaymentRegistrationModel } from 'src/app/shared/models/organization/organization-unit/organization-unit-registration.model';
import { RegistrationBaseComponent } from '../registration-base.component';
import { AccordionComponent } from '../../../../../shared/components/accordion/accordion.component';
import { NativeTableComponent } from '../../../../../shared/components/native-table/native-table.component';
import { CheckboxComponent } from '../../../../../shared/components/checkbox/checkbox.component';
import { AsyncPipe } from '@angular/common';
import { ParagraphComponent } from '../../../../../shared/components/paragraph/paragraph.component';
import { ContentSpaceBetweenComponent } from '../../../../../shared/components/content-space-between/content-space-between.component';
import { IconButtonComponent } from '../../../../../shared/components/buttons/icon-button/icon-button.component';
import { TrashcanIconComponent } from '../../../../../shared/components/icons/trashcan-icon.component';

@Component({
  selector: 'app-registrations-payments-section',
  templateUrl: './registrations-payments-section.component.html',
  styleUrl: './registrations-payments-section.component.scss',
  imports: [
    AccordionComponent,
    NativeTableComponent,
    CheckboxComponent,
    ParagraphComponent,
    ContentSpaceBetweenComponent,
    IconButtonComponent,
    TrashcanIconComponent,
    AsyncPipe
],
})
export class RegistrationsPaymentsSectionComponent
  extends RegistrationBaseComponent<APINamedEntityV2DTO>
  implements OnInit
{
  @Input() public paymentRegistrations$!: Observable<Array<PaymentRegistrationModel>>;

  public removeSinglePayment(regId: number | undefined, itContractId: number | undefined) {
    if (!regId) return;

    let request: APIChangeOrganizationUnitRegistrationV2RequestDTO = {};

    switch (this.registrationType) {
      case 'internalPayment':
        request = { paymentRegistrationDetails: [{ itContractId, internalPayments: [regId] }] };
        break;
      case 'externalPayment':
        request = { paymentRegistrationDetails: [{ itContractId, externalPayments: [regId] }] };
        break;
    }
    this.removeRegistration(request);
  }
}
