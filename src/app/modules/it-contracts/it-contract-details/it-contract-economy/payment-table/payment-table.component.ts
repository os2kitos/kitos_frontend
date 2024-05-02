import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, first } from 'rxjs';
import { APIPaymentResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { PaymentTypes } from 'src/app/shared/models/it-contract/payment-types.model';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { selectItContractHasModifyPermissions } from 'src/app/store/it-contract/selectors';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-payment-table[title][helpTextKey][paymentType]',
  templateUrl: './payment-table.component.html',
  styleUrl: './payment-table.component.scss',
})
export class PaymentTableComponent extends BaseComponent {
  @Input() public title!: string;
  @Input() public helpTextKey!: string;
  @Input() public payments$!: Observable<APIPaymentResponseDTO[]>;
  @Input() public anyPayments$!: Observable<boolean>;
  @Input() public paymentType!: PaymentTypes;

  public readonly hasModifyPermission$ = this.store.select(selectItContractHasModifyPermissions);

  constructor(private readonly store: Store, private readonly dialog: MatDialog) {
    super();
  }

  public onAddNewPayment() {
    this.dialog.open(PaymentDialogComponent);
  }

  public onEditPayment(payment: APIPaymentResponseDTO) {
    const dialogRef = this.dialog.open(PaymentDialogComponent);
    const dialogInstance = dialogRef.componentInstance as PaymentDialogComponent;
    dialogInstance.payment = payment;
    dialogInstance.isEdit = true;
    dialogInstance.paymentType = this.paymentType;
  }

  public onDeletePayment(payment: APIPaymentResponseDTO) {
    if (payment.id === undefined) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result === true) {
            this.store.dispatch(ITContractActions.removeItContractPayment(payment.id!, this.paymentType));
          }
        })
    );
  }
}
