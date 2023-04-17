import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';

@Component({
  selector: 'app-tree[nodes]',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent<T extends { children?: T[] }> {
  treeControl = new NestedTreeControl<T>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<T>();

  @Input() public set nodes(nodes: T[]) {
    this.dataSource.data = nodes;
    this.treeControl.dataNodes = nodes;
    this.treeControl.expandAll();
  }

  hasChild = (_: number, node: T) => !!node.children && node.children.length > 0;
}
