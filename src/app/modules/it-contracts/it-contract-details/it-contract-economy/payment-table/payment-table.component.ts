import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, first } from 'rxjs';
import { APIPaymentResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MAX_DIALOG_HEIGHT, NULL_PLACEHOLDER } from 'src/app/shared/constants/constants';
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
  public readonly nullPlaceholder = NULL_PLACEHOLDER;

  constructor(private readonly store: Store, private readonly dialog: MatDialog) {
    super();
  }

  public onAddNewPayment() {
    this.openPaymentDialog();
  }

  public onEditPayment(payment: APIPaymentResponseDTO) {
    const dialogInstance = this.openPaymentDialog();
    dialogInstance.payment = payment;
    dialogInstance.isEdit = true;
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

  private openPaymentDialog() {
    const dialogRef = this.dialog.open(PaymentDialogComponent, { height: '95%', maxHeight: MAX_DIALOG_HEIGHT });
    const dialogInstance = dialogRef.componentInstance as PaymentDialogComponent;
    dialogInstance.paymentType = this.paymentType;
    return dialogInstance;
  }
}
