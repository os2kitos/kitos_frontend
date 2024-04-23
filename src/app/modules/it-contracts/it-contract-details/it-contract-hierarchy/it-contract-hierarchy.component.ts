import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { mapToTree } from 'src/app/shared/helpers/hierarchy.helpers';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItContractUuid } from 'src/app/store/it-contract/selectors';
import { ItContractHierarchyComponentStore } from './it-contract-hierarchy.component-store';

@Component({
  selector: 'app-it-contract-hierarchy',
  templateUrl: './it-contract-hierarchy.component.html',
  styleUrl: './it-contract-hierarchy.component.scss',
  providers: [ItContractHierarchyComponentStore],
})
export class ItContractHierarchyComponent extends BaseComponent implements OnInit {
  public readonly contractUuid$ = this.store.select(selectItContractUuid).pipe(filterNullish());
  public readonly hierarchy$ = this.componentStore.hierarchy$.pipe(map((hierarchy) => mapToTree(hierarchy)));
  public readonly isLoading$ = this.componentStore.isLoading$;

  constructor(private readonly store: Store, private readonly componentStore: ItContractHierarchyComponentStore) {
    super();
  }
  ngOnInit(): void {
    this.componentStore.getHierarchy(this.contractUuid$);
  }
}
