import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectITSystemUsageHasModifyPermission,
  selectIsLoading,
  selectItSystemUsage,
  selectItSystemUsageName,
  selectItSystemUsageUuid,
} from 'src/app/store/it-system-usage/selectors';
import { CreateRelationDialogComponent } from './create-relation-dialog/create-relation-dialog.component';
import { ItSystemUsageDetailsRelationsComponentStore } from './it-system-usage-details-relations.component-store';

@Component({
  selector: 'app-it-system-usage-details-relations',
  templateUrl: './it-system-usage-details-relations.component.html',
  styleUrls: ['./it-system-usage-details-relations.component.scss'],
  providers: [ItSystemUsageDetailsRelationsComponentStore],
})
export class ItSystemUsageDetailsRelationsComponent extends BaseComponent implements OnInit {
  public readonly usageName$ = this.store.select(selectItSystemUsageName);
  public readonly usageIsLoading$ = this.store.select(selectIsLoading);
  public readonly usageRelations$ = this.store
    .select(selectItSystemUsage)
    .pipe(
      map((usage) =>
        usage?.outgoingSystemRelations.map((relation) =>
          this.componentStore.mapRelationResponseDTOToSystemRelationModel(relation, relation.toSystemUsage)
        )
      )
    );
  public readonly incomingRelations$ = this.componentStore.incomingRelations$;
  public readonly isLoadingIncomingRelations$ = this.componentStore.isIncomingRelationsLoading$;
  public hasModifyPermission$ = this.store.select(selectITSystemUsageHasModifyPermission);

  constructor(
    private readonly store: Store,
    private readonly componentStore: ItSystemUsageDetailsRelationsComponentStore,
    private readonly dialog: MatDialog,
    private readonly actions$: Actions
  ) {
    super();
  }

  ngOnInit() {
    //get the incoming relations
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageUuid)
        .pipe(filterNullish())
        .subscribe((systemUsageUuid) => this.componentStore.getIncomingRelations(systemUsageUuid))
    );

    //on add/patch/remove success action, reload the outgoing relations
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.addItSystemUsageRelationSuccess,
            ITSystemUsageActions.patchItSystemUsageRelationSuccess,
            ITSystemUsageActions.removeItSystemUsageRelationSuccess
          )
        )
        .subscribe(({ itSystemUsageUuid }) => {
          this.store.dispatch(ITSystemUsageActions.getItSystemUsage(itSystemUsageUuid));
        })
    );
  }

  public onAddNew() {
    this.dialog.open(CreateRelationDialogComponent);
  }
}
