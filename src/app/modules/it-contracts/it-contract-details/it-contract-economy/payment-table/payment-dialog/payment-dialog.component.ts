import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { APIIdentityNamePairResponseDTO, APIPaymentResponseDTO } from 'src/app/api/v2';
import { PaymentDialogComponentStore } from './payment-dialog.component-store';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.scss',
  providers: [PaymentDialogComponentStore],
})
export class PaymentDialogComponent {
  public readonly organizationUnits$ = this.componentStore.units$;
  public readonly organizationUnitsIsLoading$ = this.componentStore.isLoading$;

  public paymentForm = new FormGroup({
    organizationUnit: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
    acquisition: new FormControl<number | undefined>(undefined),
    operation: new FormControl<number | undefined>(undefined),
    other: new FormControl<number | undefined>(undefined),
    accountingEntry: new FormControl<number | undefined>(undefined),
    auditStatus: new FormControl<APIPaymentResponseDTO.AuditStatusEnum | undefined>(
      APIPaymentResponseDTO.AuditStatusEnum.White
    ),
    auditDate: new FormControl<Date | undefined>(undefined),
    note: new FormControl<string | undefined>(undefined),
  });

  public colorModel = {
    name: APIPaymentResponseDTO.AuditStatusEnum.White,
    id: APIPaymentResponseDTO.AuditStatusEnum.White,
  };
  public colors = [
    { name: APIPaymentResponseDTO.AuditStatusEnum.White, id: APIPaymentResponseDTO.AuditStatusEnum.White },
    { name: APIPaymentResponseDTO.AuditStatusEnum.Green, id: APIPaymentResponseDTO.AuditStatusEnum.Green },
    { name: APIPaymentResponseDTO.AuditStatusEnum.Yellow, id: APIPaymentResponseDTO.AuditStatusEnum.Yellow },
    { name: APIPaymentResponseDTO.AuditStatusEnum.Red, id: APIPaymentResponseDTO.AuditStatusEnum.Red },
  ];

  constructor(private readonly componentStore: PaymentDialogComponentStore) {}

  public searchUnits(searchTerm?: string): void {
    this.componentStore.searchOrganizationUnits(searchTerm);
  }
}
