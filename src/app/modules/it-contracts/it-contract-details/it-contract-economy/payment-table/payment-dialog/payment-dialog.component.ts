import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { APIPaymentRequestDTO, APIPaymentResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { optionalNewDate } from 'src/app/shared/helpers/date.helpers';
import { AuditModel, baseAuditStatusValue, mapAuditModel } from 'src/app/shared/models/it-contract/audit-model';
import { PaymentTypes } from 'src/app/shared/models/it-contract/payment-types.model';
import { TreeNodeModel, createNode } from 'src/app/shared/models/tree-node.model';
import { ITContractActions } from 'src/app/store/it-contract/actions';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.scss',
})
export class PaymentDialogComponent extends BaseComponent implements OnInit {
  @Input() public paymentType!: PaymentTypes;
  @Input() public isEdit = false;
  @Input() public payment?: APIPaymentResponseDTO;

  public paymentForm = new FormGroup({
    organizationUnit: new FormControl<TreeNodeModel | undefined>(undefined, Validators.required),
    acquisition: new FormControl<number>(0),
    operation: new FormControl<number>(0),
    other: new FormControl<number>(0),
    accountingEntry: new FormControl<string | undefined>(undefined),
    auditStatus: new FormControl<AuditModel | undefined>(baseAuditStatusValue),
    auditDate: new FormControl<Date | undefined>(undefined),
    note: new FormControl<string | undefined>(undefined),
  });

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly dialogRef: MatDialogRef<PaymentDialogComponent>
  ) {
    super();
  }

  public isBusy = false;

  ngOnInit(): void {
    if (this.isEdit) {
      if (this.payment?.id === undefined) {
        throw 'Payment is required for edit mode.';
      }

      const unit = this.payment?.organizationUnit;
      this.paymentForm.patchValue({
        organizationUnit: unit ? createNode(unit) : undefined,
        acquisition: this.payment?.acquisition,
        operation: this.payment?.operation,
        other: this.payment?.other,
        accountingEntry: this.payment?.accountingEntry ?? '',
        auditStatus: mapAuditModel(this.payment?.auditStatus),
        auditDate: optionalNewDate(this.payment?.auditDate),
        note: this.payment?.note,
      });
    }

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.addItContractPaymentSuccess, ITContractActions.updateItContractPaymentSuccess))
        .subscribe((result) => {
          console.log(result);
          this.close();
        })
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.addItContractPaymentError, ITContractActions.updateItContractPaymentError))
        .subscribe(() => {
          this.isBusy = false;
        })
    );
  }

  public savePayment(): void {
    if (this.paymentForm.invalid) {
      console.log('Invalid form');
      return;
    }
    const orgUnitUuid = this.paymentForm.controls.organizationUnit.value?.id;
    if (orgUnitUuid === undefined) {
      return;
    }
    this.isBusy = true;

    const request = {
      organizationUnitUuid: orgUnitUuid,
      acquisition: this.paymentForm.controls.acquisition.value,
      operation: this.paymentForm.controls.operation.value,
      other: this.paymentForm.controls.other.value,
      accountingEntry: this.paymentForm.controls.accountingEntry.value,
      auditStatus: this.paymentForm.controls.auditStatus.value?.id,
      auditDate: this.paymentForm.controls.auditDate.value,
      note: this.paymentForm.controls.note.value,
    } as APIPaymentRequestDTO;

    if (this.isEdit) {
      this.store.dispatch(ITContractActions.updateItContractPayment(this.payment!.id!, request, this.paymentType));
    } else {
      this.store.dispatch(ITContractActions.addItContractPayment(request, this.paymentType));
    }
  }

  public close(): void {
    this.dialogRef.close();
  }
}
