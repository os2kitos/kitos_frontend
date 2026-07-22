import { Component, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { BooleanValueDisplayType } from 'src/app/shared/components/status-chip/status-chip.component';
import { mapToTree } from 'src/app/shared/helpers/hierarchy.helpers';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { selectItContractUuid } from 'src/app/store/it-contract/selectors';
import { ItContractHierarchyComponentStore } from './it-contract-hierarchy.component-store';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { AsyncPipe } from '@angular/common';
import { EntityTreeComponent } from '../../../../shared/components/tree/entity-tree.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-it-contract-hierarchy',
  templateUrl: './it-contract-hierarchy.component.html',
  styleUrl: './it-contract-hierarchy.component.scss',
  providers: [ItContractHierarchyComponentStore],
  imports: [CardComponent, CardHeaderComponent, EntityTreeComponent, LoadingComponent, AsyncPipe],
})
export class ItContractHierarchyComponent extends BaseComponent implements OnInit {
  public readonly contractUuid$ = this.store.select(selectItContractUuid).pipe(filterNullish());
  public readonly hierarchy$ = this.componentStore.hierarchy$.pipe(map((hierarchy) => mapToTree(hierarchy)));
  public readonly isLoading$ = this.componentStore.isLoading$;
  public readonly extraStatusDisplayTypeValue = BooleanValueDisplayType.RequiresValidParent;

  constructor(
    private readonly store: Store,
    private readonly componentStore: ItContractHierarchyComponentStore,
    private readonly actions$: Actions,
  ) {
    super();
  }
  ngOnInit(): void {
    this.componentStore.getHierarchy(this.contractUuid$);

    this.subscriptions.add(
      this.actions$.pipe(ofType(ITContractActions.transferContractsSuccess)).subscribe(() => {
        this.componentStore.getHierarchy(this.contractUuid$);
      }),
    );
  }
}
