import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { APISystemRelationWriteRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { ItSystemUsageDetailsRelationsComponentStore } from '../it-system-usage-details-relations.component-store';

@Component({
  selector: 'app-create-relation-dialog',
  templateUrl: './create-relation-dialog.component.html',
  styleUrls: ['./create-relation-dialog.component.scss'],
  providers: [ItSystemUsageDetailsRelationsComponentStore],
})
export class CreateRelationDialogComponent extends BaseComponent {
  constructor(private readonly store: Store) {
    super();
  }

  public onSave(request: APISystemRelationWriteRequestDTO) {
    this.store.dispatch(ITSystemUsageActions.addItSystemUsageRelation(request));
  }
}
