import { Component, Input, OnInit } from '@angular/core';
import { arrayToTree } from 'performant-array-to-tree';
import { map } from 'rxjs';
import { APIRegistrationHierarchyNodeWithActivationStatusResponseDTO } from 'src/app/api/v2/model/models';
import { EntityTreeNode } from 'src/app/shared/models/structure/entity-tree-node.model';
import { ItSystemHierarchyTableComponentStore } from './it-system-hierarchy-table.component-store';

interface SystemHierachyNode extends EntityTreeNode<never> {
  parentUuid: string | undefined;
}

@Component({
  selector: 'app-it-system-hierarchy-table[systemUuid]',
  templateUrl: './it-system-hierarchy-table.component.html',
  styleUrls: ['./it-system-hierarchy-table.component.scss'],
  providers: [ItSystemHierarchyTableComponentStore],
})
export class ItSystemHierarchyTableComponent implements OnInit {
  public readonly isLoading$ = this.componentStore.isLoading$;
  public readonly treeNodes$ = this.componentStore.hierarchy$.pipe(map((hierarchy) => this.mapToTree(hierarchy)));

  @Input() public systemUuid!: string;

  constructor(private componentStore: ItSystemHierarchyTableComponentStore) {}

  private mapToTree(hierarchy: APIRegistrationHierarchyNodeWithActivationStatusResponseDTO[]) {
    const mappedHierarchy = hierarchy.map<SystemHierachyNode>((node) => ({
      uuid: node.node.uuid,
      name: node.node.name,
      isRoot: !node.parent,
      status: node.deactivated === false,
      parentUuid: node.parent?.uuid,
      children: [],
    }));
    const systemTree = arrayToTree(mappedHierarchy, { id: 'uuid', parentId: 'parentUuid', dataField: null });

    return <SystemHierachyNode[]>systemTree;
  }

  ngOnInit() {
    this.componentStore.getHierarchy(this.systemUuid);
  }
}
