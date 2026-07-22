import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatest, debounceTime, map, startWith } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { CreateEntityDialogComponentStore } from 'src/app/shared/components/entity-creation/create-entity-dialog.component-store';
import { DEFAULT_INPUT_DEBOUNCE_TIME } from 'src/app/shared/constants/constants';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { DialogComponent } from '../../../../../../shared/components/dialogs/dialog/dialog.component';
import { StandardVerticalContentGridComponent } from '../../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextBoxComponent } from '../../../../../../shared/components/textbox/textbox.component';
import { AsyncPipe } from '@angular/common';
import { ParagraphComponent } from '../../../../../../shared/components/paragraph/paragraph.component';
import { DialogActionsComponent } from '../../../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ButtonComponent } from '../../../../../../shared/components/buttons/button/button.component';

@Component({
  selector: 'app-create-and-associate-contract-dialog',
  templateUrl: './create-and-associate-contract-dialog.component.html',
  styleUrl: './create-and-associate-contract-dialog.component.scss',
  providers: [CreateEntityDialogComponentStore],
  imports: [
    DialogComponent,
    StandardVerticalContentGridComponent,
    TextBoxComponent,
    FormsModule,
    ReactiveFormsModule,
    ParagraphComponent,
    DialogActionsComponent,
    ButtonComponent,
    AsyncPipe
],
})
export class CreateAndAssociateContractDialogComponent extends BaseComponent implements OnInit {
  @Input() public usageToAssociateUuid!: string;

  public readonly formGroup = new FormGroup({
    contractName: new FormControl<string | undefined>(undefined, Validators.required),
  });

  public readonly loading$ = this.componentStore.isLoading$;
  public readonly alreadyExists$ = this.componentStore.alreadyExists$;

  public canSubmit$ = combineLatest([
    this.loading$,
    this.alreadyExists$,
    this.formGroup.statusChanges.pipe(startWith('')),
  ]).pipe(map(([isLoading, alreadyExists, formStatus]) => !isLoading && !alreadyExists && formStatus === 'VALID'));

  constructor(
    private store: Store,
    private dialogRef: MatDialogRef<CreateAndAssociateContractDialogComponent>,
    private readonly componentStore: CreateEntityDialogComponentStore,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.formGroup.controls.contractName.valueChanges
        .pipe(debounceTime(DEFAULT_INPUT_DEBOUNCE_TIME))
        .subscribe((value) => {
          if (!value) return;
          this.componentStore.checkNameAvailability({
            searchObject: { nameEquals: value },
            entityType: 'it-contract',
          });
        }),
    );
    this.subscriptions.add(
      this.alreadyExists$.subscribe((alreadyExists) => {
        if (alreadyExists) {
          this.formGroup.controls.contractName.setErrors({ alreadyExists: true });
        } else {
          this.formGroup.controls.contractName.setErrors(null);
        }
      }),
    );
  }

  public createAndRegisterContract() {
    const contractName = this.formGroup.controls.contractName.value;
    if (!contractName) return;
    this.store.dispatch(ITContractActions.createAndAssociateContract(contractName, this.usageToAssociateUuid));
    this.closeDialog();
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
