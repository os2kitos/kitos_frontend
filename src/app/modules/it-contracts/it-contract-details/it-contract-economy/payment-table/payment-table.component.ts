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
import { CardComponent } from '../../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../../shared/components/card-header/card-header.component';
import { StandardVerticalContentGridComponent } from '../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { NativeTableComponent } from '../../../../../shared/components/native-table/native-table.component';
import { ParagraphComponent } from '../../../../../shared/components/paragraph/paragraph.component';
import { ContentSpaceBetweenComponent } from '../../../../../shared/components/content-space-between/content-space-between.component';
import { ColorCircleComponent } from '../color-circle/color-circle.component';
import { IconButtonComponent } from '../../../../../shared/components/buttons/icon-button/icon-button.component';
import { PencilIconComponent } from '../../../../../shared/components/icons/pencil-icon.compnent';
import { TrashcanIconComponent } from '../../../../../shared/components/icons/trashcan-icon.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-states/empty-state.component';
import { CollectionExtensionButtonComponent } from '../../../../../shared/components/collection-extension-button/collection-extension-button.component';
import { AppDatePipe } from '../../../../../shared/pipes/app-date.pipe';

@Component({
  selector: 'app-payment-table[title][helpTextKey][paymentType]',
  templateUrl: './payment-table.component.html',
  styleUrl: './payment-table.component.scss',
  imports: [
    CardComponent,
    CardHeaderComponent,
    StandardVerticalContentGridComponent,
    NativeTableComponent,
    ParagraphComponent,
    ContentSpaceBetweenComponent,
    ColorCircleComponent,
    IconButtonComponent,
    PencilIconComponent,
    TrashcanIconComponent,
    EmptyStateComponent,
    CollectionExtensionButtonComponent,
    AsyncPipe,
    DecimalPipe,
    AppDatePipe
],
})
export class PaymentTableComponent extends BaseComponent {
  @Input() public title!: string;
  @Input() public helpTextKey!: string;
  @Input() public payments$!: Observable<APIPaymentResponseDTO[]>;
  @Input() public anyPayments$!: Observable<boolean>;
  @Input() public paymentType!: PaymentTypes;

  public readonly hasModifyPermission$ = this.store.select(selectItContractHasModifyPermissions);
  public readonly nullPlaceholder = NULL_PLACEHOLDER;

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
  ) {
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
        }),
    );
  }

  private openPaymentDialog() {
    const dialogRef = this.dialog.open(PaymentDialogComponent, { height: '95%', maxHeight: MAX_DIALOG_HEIGHT });
    const dialogInstance = dialogRef.componentInstance as PaymentDialogComponent;
    dialogInstance.paymentType = this.paymentType;
    return dialogInstance;
  }
}
