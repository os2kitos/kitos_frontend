import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import {
  selectItSystemUsage,
  selectItSystemUsageName,
  selectItSystemUsageUuid,
} from 'src/app/store/it-system-usage/selectors';
import { ItSystemUsageDetailsRelationsComponentStore } from './it-system-usage-details-relations.component-store';
import { ModifyRelationDialogComponent } from './modify-relation-dialog/modify-relation-dialog.component';

@Component({
  selector: 'app-it-system-usage-details-relations',
  templateUrl: './it-system-usage-details-relations.component.html',
  styleUrls: ['./it-system-usage-details-relations.component.scss'],
  providers: [ItSystemUsageDetailsRelationsComponentStore],
})
export class ItSystemUsageDetailsRelationsComponent extends BaseComponent implements OnInit {
  public readonly usageName$ = this.store.select(selectItSystemUsageName);
  public readonly usage$ = this.store.select(selectItSystemUsage);
  public readonly usageRelations$ = this.usage$.pipe(
    map((usage) =>
      usage?.outgoingSystemRelations.map((relation) =>
        this.componentStore.mapRelationResponseDTOToSystemRelationModel(relation, relation.toSystemUsage)
      )
    )
  );
  public readonly incomingRelations$ = this.componentStore.incomingRelations$;
  public readonly isLoadingIncomingRelations$ = this.componentStore.isIncomingRelationsLoading$;

  constructor(
    private readonly store: Store,
    private readonly componentStore: ItSystemUsageDetailsRelationsComponentStore,
    private readonly dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageUuid)
        .pipe(filterNullish())
        .subscribe((systemUsageUuid) => this.componentStore.getIncomingRelations(systemUsageUuid))
    );
  }

  public onAddNew() {
    this.dialog.open(ModifyRelationDialogComponent);
  }
}
