import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { EntityTreeNode } from '../../models/structure/entity-tree-node.model';

@Component({
  selector: 'app-tree[nodes][itemType]',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent<T> implements OnInit {
  public readonly treeControl = new NestedTreeControl<EntityTreeNode<T>>((node) => node.children);
  public readonly dataSource = new MatTreeNestedDataSource<EntityTreeNode<T>>();
  public toggleStatusText = 'status';

  @Input() public showStatus = false;
  @Input() public allowExpandCollapse = true;
  @Input() public itemType!: RegistrationEntityTypes;
  @Input() public currentNodeUuid?: string;
  @Input() public set nodes(nodes: EntityTreeNode<T>[]) {
    this.dataSource.data = nodes;
    this.treeControl.dataNodes = nodes;
    this.treeControl.expandAll();
  }

  public readonly hasChild = (_: number, node: EntityTreeNode<T>) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    switch (this.itemType) {
      case 'it-system-usage':
      case 'it-system':
        this.toggleStatusText = $localize`Vis tilgængelighed`;
        break;
      case 'it-contract':
        this.toggleStatusText = $localize`Vis gyldighed`;
        break;
      default:
        throw 'Unsupported item type:' + this.itemType;
    }
  }
}
