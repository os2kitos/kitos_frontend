import { Component, OnInit } from '@angular/core';
import { BaseDropdownComponent } from '../../base/base-dropdown.component';
import { TreeNodeModel } from '../../models/tree-node.model';

@Component({
  selector: 'app-tree-node-dropdown',
  templateUrl: './tree-node-dropdown.component.html',
  styleUrls: ['./tree-node-dropdown.component.scss'],
})
export class TreeNodeDropdownComponent extends BaseDropdownComponent<TreeNodeModel | null> implements OnInit {
  constructor() {
    super();
  }

  private itemsWithParents: { key: string; parentIds: string[] }[] = [];
  private lookup: { term: string; data: string[]; parents: string[] } | null = null;

  override ngOnInit() {
    super.ngOnInit();

    //map parents of each item
    this.data?.forEach((item) => {
      const node = item as TreeNodeModel;
      this.itemsWithParents?.push({
        key: node.id,
        parentIds: this.getParents(node, this.data as TreeNodeModel[]).map((x) => x.id),
      });
    });
  }

  public searchWitItemParents = (term: string, item: TreeNodeModel) => {
    const treeNodes = this.data as TreeNodeModel[];

    if (!this.lookup || this.lookup.term !== term) {
      //get nodes that match the term
      const nodes = treeNodes
        .filter((x) => x.name.toLocaleLowerCase().includes(term.toLocaleLowerCase()))
        .map((x) => x.id);

      //get parents of the nodes
      let parents = [] as string[];
      this.itemsWithParents
        .filter((x) => nodes.includes(x.key))
        .forEach((x) => {
          parents = parents.concat(x.parentIds);
        });
      this.lookup = { term: term, data: nodes, parents: parents };
    }

    return this.lookup.data.includes(item.id) || this.lookup.parents.includes(item.id);
  };

  private getParents(item: TreeNodeModel, data: TreeNodeModel[]): TreeNodeModel[] {
    let result = [item] as TreeNodeModel[];
    data
      .filter((x) => x.id === item.parentId)
      .forEach((x) => {
        result = result.concat(this.getParents(x, data));
      });

    return result;
  }
}
