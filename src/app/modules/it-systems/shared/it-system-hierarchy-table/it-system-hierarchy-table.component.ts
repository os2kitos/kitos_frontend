import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { BooleanValueDisplayType } from 'src/app/shared/components/status-chip/status-chip.component';
import { mapSystemToTree } from 'src/app/shared/helpers/hierarchy.helpers';
import { ItSystemHierarchyTableComponentStore } from './it-system-hierarchy-table.component-store';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { EntityTreeComponent } from '../../../../shared/components/tree/entity-tree.component';

@Component({
  selector: 'app-it-system-hierarchy-table[systemUuid]',
  templateUrl: './it-system-hierarchy-table.component.html',
  styleUrls: ['./it-system-hierarchy-table.component.scss'],
  providers: [ItSystemHierarchyTableComponentStore],
  imports: [CardComponent, CardHeaderComponent, NgIf, LoadingComponent, EntityTreeComponent, AsyncPipe],
})
export class ItSystemHierarchyTableComponent implements OnInit {
  public readonly isLoading$ = this.componentStore.isLoading$;
  public readonly treeNodes$ = this.componentStore.hierarchy$.pipe(map((hierarchy) => mapSystemToTree(hierarchy)));
  public readonly extraStatusDisplayTypeValue = BooleanValueDisplayType.InUseNotInUse;

  @Input() public systemUuid!: string;

  constructor(private componentStore: ItSystemHierarchyTableComponentStore) {}

  ngOnInit() {
    this.componentStore.getHierarchy(this.systemUuid);
  }
}
