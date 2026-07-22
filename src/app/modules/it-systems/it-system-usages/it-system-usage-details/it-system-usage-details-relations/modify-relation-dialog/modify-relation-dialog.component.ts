import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, first, map } from 'rxjs';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { ConnectedDropdownComponent } from 'src/app/shared/components/dropdowns/connected-dropdown/connected-dropdown.component';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { ItSystemUsageDetailsRelationsDialogComponentStore } from '../system-relation-dialog/relation-dialog.component-store';
import { SystemRelationDialogComponent, SystemRelationDialogFormModel } from '../system-relation-dialog/system-relation-dialog.component';
import { SystemRelationModel } from '../relation-table/relation-grid.component';

interface SystemRelationModifyDialogFormModel extends SystemRelationDialogFormModel {
  interface: FormControl<APIIdentityNamePairResponseDTO | null | undefined>;
}

@Component({
  selector: 'app-modify-relation-dialog[relationModel]',
  templateUrl: './modify-relation-dialog.component.html',
  styleUrls: ['./modify-relation-dialog.component.scss'],
  providers: [ItSystemUsageDetailsRelationsDialogComponentStore],
  imports: [SystemRelationDialogComponent, ConnectedDropdownComponent],
})
export class ModifyRelationDialogComponent extends SystemRelationDialogComponent implements OnInit {
  @Input() public override relationModel!: SystemRelationModel;

  public override formGroup!: FormGroup<SystemRelationModifyDialogFormModel>;
  public readonly interfaces$ = this.componentStore.interfaces$;

  constructor(
    protected override readonly store: Store,
    protected override readonly componentStore: ItSystemUsageDetailsRelationsDialogComponentStore,
    protected override readonly dialog: MatDialogRef<ModifyRelationDialogComponent>,
    protected override readonly actions$: Actions
  ) {
    super(store, componentStore, dialog, actions$);
  }

  ngOnInit(): void {
    this.setupChangeSubscriptions();
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system_usage-relation-frequency-type'));

    //on selected system usage change or interface search change, load the interfaces
    this.subscriptions.add(
      combineLatest([this.selectedSystemUuid$, this.searchInterfaceTerm$])
        .pipe(map(([systemUuid, searchTerm]) => ({ systemUuid, searchTerm })))
        .subscribe(({ systemUuid, searchTerm }) => {
          this.componentStore.getItInterfaces({ systemUuid: systemUuid, search: searchTerm });
        })
    );

    //on success close the dialog
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.addItSystemUsageRelationSuccess,
            ITSystemUsageActions.patchItSystemUsageRelationSuccess
          ),
          first()
        )
        .subscribe(() => this.dialog.close())
    );

    //on error set isBusy to false
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.addItSystemUsageRelationError,
            ITSystemUsageActions.patchItSystemUsageRelationError
          )
        )
        .subscribe(() => {
          this.isBusy = false;
        })
    );

    this.formGroup = new FormGroup<SystemRelationModifyDialogFormModel>({
      systemUsage: new FormControl<APIIdentityNamePairResponseDTO | undefined>(
        {
          value: this.relationModel.systemUsage,
          disabled: false,
        },
        Validators.required
      ),
      description: new FormControl<string | undefined>({ value: this.relationModel.description, disabled: false }),
      reference: new FormControl<string | undefined>({ value: this.relationModel.urlReference, disabled: false }),
      contract: new FormControl<APIIdentityNamePairResponseDTO | undefined>({
        value: this.relationModel.associatedContract,
        disabled: false,
      }),
      interface: new FormControl<APIIdentityNamePairResponseDTO | undefined>({
        value: this.relationModel.relationInterface,
        disabled: false,
      }),
      frequency: new FormControl<APIIdentityNamePairResponseDTO | undefined>({
        value: this.relationModel.relationFrequency,
        disabled: false,
      }),
    });

    //update the current usage uuid
    this.componentStore.updateCurrentSystemUuid(this.relationModel.systemUsage.uuid);

    //when usage is selected enable the form, otherwise turn it off (other than the usage dropdown)
    this.subscriptions.add(
      this.changedSystemUsageUuid$.subscribe((usageUuid) => {
        this.formGroup.controls.interface.reset();
        if (usageUuid) {
          this.formGroup.enable();
        } else {
          this.formGroup.disable();
          this.formGroup.controls['systemUsage'].enable();
        }
      })
    );
  }

  public save() {
    if (!this.formGroup.valid) return;

    const usage = this.formGroup.value.systemUsage;
    if (!usage) return;

    this.isBusy = true;
    const formValue = this.formGroup.value;

    const request = {
      toSystemUsageUuid: usage.uuid,
      relationInterfaceUuid: formValue.interface?.uuid,
      associatedContractUuid: formValue.contract?.uuid,
      relationFrequencyUuid: formValue.frequency?.uuid,
      description: formValue.description ?? undefined,
      urlReference: formValue.reference ?? undefined,
    };

    this.store.dispatch(ITSystemUsageActions.patchItSystemUsageRelation(this.relationModel.uuid, request));
  }
}
