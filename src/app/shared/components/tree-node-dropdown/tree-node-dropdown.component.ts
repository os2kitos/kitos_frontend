import { Component, OnInit } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { BaseDropdownComponent } from '../../base/base-dropdown.component';
import { TreeNodeModel } from '../../models/tree-node.model';

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
  private lookup: { searchName: string; unitIdsWithMatchingName: string[]; foundUnitsParentIds: string[] } = {
    searchName: '',
    unitIdsWithMatchingName: [],
    foundUnitsParentIds: [],
  };

  override ngOnInit() {
    super.ngOnInit();

    if (!this.data) return;
    const dataDictionary = Object.fromEntries(this.data.map((x) => [x.id, x]));

    //create a dictionary for items and their parentIds for a quick lookup
    this.itemParentIdsDictionary = Object.fromEntries(
      this.data.map((item) => {
        const node = item as TreeNodeModel;
        const result = this.getParents(node, dataDictionary).map((x) => x.id);
        return [item.id, result];
      })
    );

    //sort the array so it appears in the correct order
    this.data.forEach((item) => {
      if (!item.parentId) {
        this.sortedData.push(item);
        return;
      }
      const parent = this.sortedData.find((x) => x.id === item.parentId);
      if (parent) {
        this.sortedData.splice(this.sortedData.indexOf(parent) + 1, 0, item);
      }
    });
  }

  public searchWitItemParents = (searchName: string, item: TreeNodeModel) => {
    const treeNodes = this.data as TreeNodeModel[];

    if (this.lookup.searchName !== searchName) {
      //get ids of nodes that match the search name
      const nodeIds = treeNodes
        .filter((x) => x.name.toLocaleLowerCase().includes(searchName.toLocaleLowerCase()))
        .map((x) => x.id);

      //get parents of the nodes
      let parents = [] as string[];
      nodeIds.forEach((id) => {
        parents = parents.concat(this.itemParentIdsDictionary[id] ?? []);
      });
      this.lookup = { searchName: searchName, unitIdsWithMatchingName: nodeIds, foundUnitsParentIds: parents };
    }

    return this.lookup.unitIdsWithMatchingName.includes(item.id) || this.lookup.foundUnitsParentIds.includes(item.id);
  };

  private getParents(item: TreeNodeModel, data: Dictionary<TreeNodeModel>): TreeNodeModel[] {
    let result = [item] as TreeNodeModel[];

    const parent = data[item.parentId];
    if (!parent) return result;
    result = result.concat(this.getParents(parent, data));

    return result;
  }
}
