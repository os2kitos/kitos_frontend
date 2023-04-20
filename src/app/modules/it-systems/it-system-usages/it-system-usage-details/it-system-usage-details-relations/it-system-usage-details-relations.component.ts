import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { selectItSystemUsage, selectItSystemUsageName } from 'src/app/store/it-system-usage/selectors';
import { ItSystemUsageDetailsRelationsComponentStore } from './it-system-usage-details-relations.component-store';

@Component({
  selector: 'app-it-system-usage-details-relations',
  templateUrl: './it-system-usage-details-relations.component.html',
  styleUrls: ['./it-system-usage-details-relations.component.scss'],
  providers: [ItSystemUsageDetailsRelationsComponentStore],
})
export class ItSystemUsageDetailsRelationsComponent extends BaseComponent {
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
    private readonly componentStore: ItSystemUsageDetailsRelationsComponentStore
  ) {
    super();
  }
}
