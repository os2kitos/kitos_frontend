import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first, Subject } from 'rxjs';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { ConnectedMultiSelectDropdownComponent } from 'src/app/shared/components/dropdowns/connected-multi-select-dropdown/connected-multi-select-dropdown.component';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { ItSystemUsageDetailsRelationsDialogComponentStore } from '../system-relation-dialog/relation-dialog.component-store';
import { SystemRelationDialogComponent, SystemRelationDialogFormModel } from '../system-relation-dialog/system-relation-dialog.component';

 interface SystemRelationCreateDialogFormModel extends SystemRelationDialogFormModel {
  interfaces: FormControl<APIIdentityNamePairResponseDTO[] | null | undefined>;
}

@Component({
  selector: 'app-create-relation-dialog',
  templateUrl: './create-relation-dialog.component.html',
  styleUrls: ['./create-relation-dialog.component.scss'],
  providers: [ItSystemUsageDetailsRelationsDialogComponentStore],
  imports: [SystemRelationDialogComponent, ConnectedMultiSelectDropdownComponent],
})
export class CreateRelationDialogComponent extends SystemRelationDialogComponent {
  public override formGroup = new FormGroup<SystemRelationCreateDialogFormModel>({
    systemUsage: new FormControl<APIIdentityNamePairResponseDTO |  undefined>(
      { value: undefined, disabled: false },
      Validators.required
    ),
    description: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    reference: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    contract: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    interfaces: new FormControl<APIIdentityNamePairResponseDTO[] | undefined>({ value: undefined, disabled: true }),
    frequency: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
  });

  public readonly interfacesAsMultiSelectDropdownItems$ = this.componentStore.interfacesAsMultiSelectDropdownItems$;

  public readonly interfacesDropdownResetSubject$ = new Subject<void>();

  public clearInterfaceInputFlag$ = new Subject<boolean>();

  constructor(
    protected override readonly store: Store,
    protected override readonly componentStore: ItSystemUsageDetailsRelationsDialogComponentStore,
    protected override readonly dialog: MatDialogRef<CreateRelationDialogComponent>,
    protected override readonly actions$: Actions
  ) {
    super(store, componentStore, dialog, actions$);
  }

  ngOnInit(): void {
    this.setupChangeSubscriptions();
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system_usage-relation-frequency-type'));

    //when usage is selected enable the form, otherwise turn it off (other than the usage dropdown)
    this.subscriptions.add(
      this.changedSystemUsageUuid$.subscribe((usageUuid) => {
        this.interfacesDropdownResetSubject$.next();
        if (usageUuid) {
          this.formGroup.enable();
        } else {
          this.formGroup.disable();
          this.formGroup.controls['systemUsage'].enable();
        }
      })
    );

    //on success close the dialog
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.addItSystemUsageRelationsSuccess,
            ITSystemUsageActions.patchItSystemUsageRelationSuccess
          ),
          first()
        )
        .subscribe(() => this.dialog.close())
    );
  }

  public interfaceValueChange(newInterfaces: APIIdentityNamePairResponseDTO[]) {
    this.formGroup.controls.interfaces.setValue(newInterfaces);
  }

  public save() {
    if (!this.formGroup.valid) return;

    const usage = this.formGroup.value.systemUsage;
    if (!usage) return;

    this.isBusy = true;

    const formValue = this.formGroup.value;
    const interfacesValue = formValue.interfaces;

    const requests =
      interfacesValue && interfacesValue.length > 0
        ? interfacesValue.map((x) => ({
            toSystemUsageUuid: usage.uuid,
            relationInterfaceUuid: x.uuid,
            associatedContractUuid: formValue.contract?.uuid,
            relationFrequencyUuid: formValue.frequency?.uuid,
            description: formValue.description ?? undefined,
            urlReference: formValue.reference ?? undefined,
          }))
        : [
            {
              toSystemUsageUuid: usage.uuid,
              relationInterfaceUuid: undefined,
              associatedContractUuid: formValue.contract?.uuid,
              relationFrequencyUuid: formValue.frequency?.uuid,
              description: formValue.description ?? undefined,
              urlReference: formValue.reference ?? undefined,
            },
          ];
    this.store.dispatch(ITSystemUsageActions.addItSystemUsageRelations(requests));
  }
}
