import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { distinctUntilChanged } from 'rxjs';
import { APIPaymentRequestDTO, APIPaymentResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { optionalNewDate } from 'src/app/shared/helpers/date.helpers';
import { fromAnyToNumber } from 'src/app/shared/helpers/number.helpers';
import { AuditModel, baseAuditStatusValue, mapAuditModel } from 'src/app/shared/models/it-contract/audit-model';
import { PaymentTypes } from 'src/app/shared/models/it-contract/payment-types.model';
import { TreeNodeModel, createNode } from 'src/app/shared/models/tree-node.model';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { DialogComponent } from '../../../../../../shared/components/dialogs/dialog/dialog.component';
import { StandardVerticalContentGridComponent } from '../../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { OrgUnitSelectComponent } from '../../../../../../shared/components/org-unit-select/org-unit-select.component';
import { NumericInputComponent } from '../../../../../../shared/components/numeric-input/numeric-input.component';
import { TextBoxComponent } from '../../../../../../shared/components/textbox/textbox.component';
import { AuditPickerComponent } from './color-picker/audit-picker.component';
import { DatePickerComponent } from '../../../../../../shared/components/datepicker/datepicker.component';
import { TextAreaComponent } from '../../../../../../shared/components/textarea/textarea.component';
import { DialogActionsComponent } from '../../../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ButtonComponent } from '../../../../../../shared/components/buttons/button/button.component';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.scss',
  imports: [
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    StandardVerticalContentGridComponent,
    OrgUnitSelectComponent,
    NumericInputComponent,
    TextBoxComponent,
    AuditPickerComponent,
    DatePickerComponent,
    TextAreaComponent,
    DialogActionsComponent,
    ButtonComponent,
  ],
})
export class PaymentDialogComponent extends BaseComponent implements OnInit {
  @Input() public paymentType!: PaymentTypes;
  @Input() public isEdit = false;
  @Input() public payment?: APIPaymentResponseDTO;

  public paymentForm = new FormGroup({
    organizationUnit: new FormControl<TreeNodeModel | undefined>(undefined, Validators.required),
    acquisition: new FormControl<number>({ value: 0, disabled: true }),
    operation: new FormControl<number>({ value: 0, disabled: true }),
    other: new FormControl<number>({ value: 0, disabled: true }),
    accountingEntry: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    auditStatus: new FormControl<AuditModel | undefined>({ value: baseAuditStatusValue, disabled: true }),
    auditDate: new FormControl<Date | undefined>({ value: undefined, disabled: true }),
    note: new FormControl<string | undefined>({ value: undefined, disabled: true }),
  });

  public isBusy = false;
  public title: string = '';
  public saveText: string = '';

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly dialogRef: MatDialogRef<PaymentDialogComponent>,
  ) {
    super();
  }

  ngOnInit(): void {
    this.title = this.paymentType === 'internal' ? $localize`Intern betaling` : $localize`Ekstern betaling`;
    this.saveText = this.isEdit ? $localize`Gem` : $localize`Tilføj`;

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
      this.paymentForm.enable();
    }

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.addItContractPaymentSuccess, ITContractActions.updateItContractPaymentSuccess))
        .subscribe((_) => {
          this.close();
        }),
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITContractActions.addItContractPaymentError, ITContractActions.updateItContractPaymentError))
        .subscribe(() => {
          this.isBusy = false;
        }),
    );

    this.subscriptions.add(
      this.paymentForm.statusChanges.pipe(distinctUntilChanged()).subscribe((status) => {
        if (status === 'VALID') {
          this.paymentForm.enable();
        } else {
          this.paymentForm.disable();
          this.paymentForm.controls.organizationUnit.enable();
        }
      }),
    );
  }

  public savePayment(): void {
    if (this.paymentForm.invalid) {
      return;
    }
    const controls = this.paymentForm.controls;
    const orgUnitUuid = controls.organizationUnit.value?.id;
    if (orgUnitUuid === undefined) {
      return;
    }
    this.isBusy = true;
    const request = {
      organizationUnitUuid: orgUnitUuid,
      acquisition: fromAnyToNumber(controls.acquisition.value),
      operation: fromAnyToNumber(controls.operation.value),
      other: fromAnyToNumber(controls.other.value),
      accountingEntry: controls.accountingEntry.value,
      auditStatus: controls.auditStatus.value?.id,
      auditDate: controls.auditDate.value?.toISOString(),
      note: controls.note.value,
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
