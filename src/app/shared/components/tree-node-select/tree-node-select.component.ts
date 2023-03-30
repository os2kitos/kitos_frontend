import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Observable } from 'rxjs';
import { BaseFormComponent } from '../../base/base-form.component';
interface FoodNode {
  name: string;
  children?: FoodNode[];
}
export interface TreeNodeModel {
  id: string;
  name: string;
  disabled: boolean;
  parentId: string;
  indent: number;
}

@Component({
  selector: 'app-tree-node-select',
  templateUrl: './tree-node-select.component.html',
  styleUrls: ['./tree-node-select.component.scss'],
})
export class TreeNodeSelectComponent<T> extends BaseFormComponent<T | null> implements OnInit {
  @Input() public nodes$!: Observable<TreeNodeModel[]>;
  @Input() public textField = 'name';
  @Input() public valueField = 'value';
  @Input() public showDescription = false;

  @Output() public filterChange = new EventEmitter<string | undefined>();

  treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();

  constructor() {
    super();

    this.dataSource.data = this.testData;
  }

  public testData = [
    {
      name: 'Fruit',
      children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
    },
    {
      name: 'Vegetables',
      children: [
        {
          name: 'Green',
          children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
        },
        {
          name: 'Orange',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
        },
      ],
    },
  ];
  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
}
