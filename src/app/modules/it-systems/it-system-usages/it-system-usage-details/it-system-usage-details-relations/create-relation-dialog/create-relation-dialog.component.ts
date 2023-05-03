import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { APIIdentityNamePairResponseDTO, APISystemRelationWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { SystemRelationDialogFormModel } from '../base-relation-dialog/base-relation-dialog.component';
import { ItSystemUsageDetailsRelationsDialogComponentStore } from '../base-relation-dialog/relation-dialog.component-store';

@Component({
  selector: 'app-create-relation-dialog',
  templateUrl: './create-relation-dialog.component.html',
  styleUrls: ['./create-relation-dialog.component.scss'],
  providers: [ItSystemUsageDetailsRelationsDialogComponentStore],
})
export class CreateRelationDialogComponent extends BaseComponent {
  public relationForm = new FormGroup<SystemRelationDialogFormModel>({
    systemUsage: new FormControl<APIIdentityNamePairResponseDTO | undefined>(
      { value: undefined, disabled: false },
      Validators.required
    ),
    description: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    reference: new FormControl<string | undefined>({ value: undefined, disabled: true }),
    contract: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    interface: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
    frequency: new FormControl<APIIdentityNamePairResponseDTO | undefined>({ value: undefined, disabled: true }),
  });

  constructor(private readonly store: Store) {
    super();
  }

  public onSave(request: APISystemRelationWriteRequestDTO) {
    this.store.dispatch(ITSystemUsageActions.addItSystemUsageRelation(request));
  }
}
