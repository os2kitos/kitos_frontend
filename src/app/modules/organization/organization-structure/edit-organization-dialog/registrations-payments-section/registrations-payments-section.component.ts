import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { APINamedEntityV2DTO } from 'src/app/api/v2';
import { PaymentRegistrationModel } from 'src/app/shared/models/organization-unit/organization-unit-registration.model';
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
}
