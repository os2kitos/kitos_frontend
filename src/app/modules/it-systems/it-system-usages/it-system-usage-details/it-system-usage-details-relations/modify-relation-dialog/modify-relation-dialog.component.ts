import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { APIIdentityNamePairResponseDTO, APISystemRelationWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { SystemRelationModel } from '../relation-table/relation-table.component';
import { ItSystemUsageDetailsRelationsDialogComponentStore } from '../system-relation-dialog/relation-dialog.component-store';
import { SystemRelationDialogFormModel } from '../system-relation-dialog/system-relation-dialog.component';

@Component({
  selector: 'app-modify-relation-dialog[relationModel]',
  templateUrl: './modify-relation-dialog.component.html',
  styleUrls: ['./modify-relation-dialog.component.scss'],
  providers: [ItSystemUsageDetailsRelationsDialogComponentStore],
})
export class ModifyRelationDialogComponent extends BaseComponent implements OnInit {
  @Input() public relationModel!: SystemRelationModel;

  public relationForm!: FormGroup<SystemRelationDialogFormModel>;

  constructor(
    private readonly store: Store,
    private readonly componentStore: ItSystemUsageDetailsRelationsDialogComponentStore
  ) {
    super();
  }

  public ngOnInit(): void {
    this.relationForm = new FormGroup<SystemRelationDialogFormModel>({
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
  }

  public onModifySave(request: APISystemRelationWriteRequestDTO) {
    this.store.dispatch(ITSystemUsageActions.patchItSystemUsageRelation(this.relationModel.uuid, request));
  }
}
