import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { EntityTreeNode } from '../../models/structure/entity-tree-node.model';

@Component({
  selector: 'app-tree[nodes][itemType]',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent<T> {
  public readonly treeControl = new NestedTreeControl<EntityTreeNode<T>>((node) => node.children);
  public readonly dataSource = new MatTreeNestedDataSource<EntityTreeNode<T>>();

  @Input() public allowExpandCollapse = true;
  @Input() public itemType!: RegistrationEntityTypes;
  @Input() public currentNodeUuid?: string;
  @Input() public set nodes(nodes: EntityTreeNode<T>[]) {
    this.dataSource.data = nodes;
    this.treeControl.dataNodes = nodes;
    this.treeControl.expandAll();
  }

  public readonly hasChild = (_: number, node: EntityTreeNode<T>) => !!node.children && node.children.length > 0;
}
