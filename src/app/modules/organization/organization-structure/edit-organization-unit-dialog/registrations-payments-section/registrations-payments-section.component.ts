import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { APIChangeOrganizationUnitRegistrationV2RequestDTO, APINamedEntityV2DTO } from 'src/app/api/v2';
import { PaymentRegistrationModel } from 'src/app/shared/models/organization/organization-unit/organization-unit-registration.model';
import { RegistrationBaseComponent } from '../registration-base.component';

@Component({
  selector: 'app-registrations-payments-section',
  templateUrl: './registrations-payments-section.component.html',
  styleUrl: './registrations-payments-section.component.scss',
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
