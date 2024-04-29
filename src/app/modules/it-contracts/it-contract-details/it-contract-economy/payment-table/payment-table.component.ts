import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { APIPaymentResponseDTO } from 'src/app/api/v2';
import { selectItContractHasModifyPermissions } from 'src/app/store/it-contract/selectors';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-payment-table[title][helpTextKey]',
  templateUrl: './payment-table.component.html',
  styleUrl: './payment-table.component.scss',
})
export class PaymentTableComponent {
  @Input() public title!: string;
  @Input() public helpTextKey!: string;
  @Input() public payments$!: Observable<APIPaymentResponseDTO[]>;
  @Input() public anyPayments$!: Observable<boolean>;

  public readonly hasModifyPermission$ = this.store.select(selectItContractHasModifyPermissions);

  constructor(private readonly store: Store, private readonly dialog: MatDialog) {}

  public onAddNewPayment() {
    this.dialog.open(PaymentDialogComponent);
  }
}
