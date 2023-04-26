import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { APISystemRelationWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { ItSystemUsageDetailsRelationsComponentStore } from '../it-system-usage-details-relations.component-store';
import { SystemRelationModel } from '../relation-table/relation-table.component';

@Component({
  selector: 'app-modify-relation-dialog[relationUuid]',
  templateUrl: './modify-relation-dialog.component.html',
  styleUrls: ['./modify-relation-dialog.component.scss'],
  providers: [ItSystemUsageDetailsRelationsComponentStore],
})
export class ModifyRelationDialogComponent extends BaseComponent {
  @Input() public relationModel!: SystemRelationModel;

  constructor(private readonly store: Store) {
    super();
  }

  public onSave(request: APISystemRelationWriteRequestDTO) {
    this.store.dispatch(ITSystemUsageActions.patchItSystemUsageRelation(this.relationModel.uuid, request));
  }
}
