import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { EntityTreeNode, EntityTreeNodeMoveResult } from '../../models/structure/entity-tree-node.model';

@Component({
  selector: 'app-entity-tree[nodes][itemType]',
  templateUrl: './entity-tree.component.html',
  styleUrls: ['./entity-tree.component.scss'],
})
export class EntityTreeComponent<T> implements OnInit {
  public readonly treeControl = new NestedTreeControl<EntityTreeNode<T>>((node) => node.children);
  public readonly dataSource = new MatTreeNestedDataSource<EntityTreeNode<T>>();
  public toggleStatusText = 'status';

  @Input() public showStatus = false;
  @Input() public hideStatusButton = false;
  @Input() public itemType!: RegistrationEntityTypes;
  @Input() public currentNodeUuid?: string;
  @Input() public originalList: T[] = [];
  @Input() public set nodes(nodes: EntityTreeNode<T>[]) {
    this.dataSource.data = nodes;
    this.treeControl.dataNodes = nodes;
    this.treeControl.expandAll();
  }
  @Input() public disableDrag = true;

  @Output() public readonly nodeMoved = new EventEmitter<EntityTreeNodeMoveResult<T>>();

  public readonly hasChild = (_: number, node: EntityTreeNode<T>) => node.children?.length > 0;

  ngOnInit(): void {
    switch (this.itemType) {
      case 'organization':
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

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousIndex === event.currentIndex) return;
    //the index is smaller by 1 than the actual index because the root node is not included in the list
    const nodeIndex = event.previousIndex + 1;
    const targetParentIndex = event.currentIndex + 1;
    const currentNode = this.originalList[nodeIndex];
    const parentNode = this.originalList[targetParentIndex];

    this.nodeMoved.emit({ movedNode: currentNode, targetParentNode: parentNode });
  }
}
