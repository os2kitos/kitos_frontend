import { Component, OnInit } from '@angular/core';
import { BaseDropdownComponent } from '../../../base/base-dropdown.component';
import { Dictionary } from '../../../models/primitives/dictionary.model';
import { TreeNodeModel } from '../../../models/tree-node.model';

@Component({
  selector: 'app-tree-node-dropdown',
  templateUrl: './tree-node-dropdown.component.html',
  styleUrls: ['./tree-node-dropdown.component.scss'],
})
export class TreeNodeDropdownComponent extends BaseDropdownComponent<TreeNodeModel> implements OnInit {
  constructor() {
    super();
  }

  public sortedData: TreeNodeModel[] = [];

  public itemParentIdsDictionary: Dictionary<string[]> = {};
  private searchResult: { searchName: string; unitIdsWithMatchingName: string[]; foundUnitsParentIds: string[] } = {
    searchName: '',
    unitIdsWithMatchingName: [],
    foundUnitsParentIds: [],
  };

  override ngOnInit() {
    super.ngOnInit();

    if (!this.data) return;

    //Build a lookup of node->children
    const childrenDictionary: Dictionary<TreeNodeModel[]> = {};
    this.data.forEach((node) => {
      const parentId = node.parentId;

      //The root has no parent so skip that
      if (parentId) {
        let children = childrenDictionary[parentId];
        if (!children) {
          children = [];
          childrenDictionary[parentId] = children;
        }
        children.push(node);
      }
    });

    //Build final selection/lookup model
    this.data
      .filter((x) => !x.parentId)
      .forEach((root) => {
        this.processSubtree(root, [], childrenDictionary);
      });
  }

  public searchWithItemParents = (searchName: string, item: TreeNodeModel) => {
    const treeNodes = this.data as TreeNodeModel[];

    if (this.searchResult.searchName !== searchName) {
      //get ids of nodes that match the search name
      const nodeIds = treeNodes
        .filter((x) => x.name.toLocaleLowerCase().includes(searchName.toLocaleLowerCase()))
        .map((x) => x.id);

      //get parents of the nodes
      let parents = [] as string[];
      nodeIds.forEach((id) => {
        parents = parents.concat(this.itemParentIdsDictionary[id] ?? []);
      });
      this.searchResult = { searchName: searchName, unitIdsWithMatchingName: nodeIds, foundUnitsParentIds: parents };
    }

    return (
      this.searchResult.unitIdsWithMatchingName.includes(item.id) ||
      this.searchResult.foundUnitsParentIds.includes(item.id)
    );
  };

  private processSubtree(
    currentItem: TreeNodeModel,
    ancestors: Array<string>,
    childrenDictionary: Dictionary<TreeNodeModel[]>
  ) {
    this.itemParentIdsDictionary[currentItem.id] = ancestors;
    this.sortedData.push(currentItem);

    const children = childrenDictionary[currentItem.id];
    children?.sort((a, b) => a.name.localeCompare(b.name));

    children?.forEach((child) => this.processSubtree(child, ancestors.concat(currentItem.id), childrenDictionary));
  }
}
