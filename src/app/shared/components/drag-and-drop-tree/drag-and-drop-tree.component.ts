import { NestedTreeControl } from '@angular/cdk/tree';
import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { EntityTreeNode, EntityTreeNodeMoveResult } from '../../models/structure/entity-tree-node.model';

interface DropInfo {
  targetId: string;
  action?: string;
}

@Component({
  selector: 'app-drag-and-drop-tree[nodes][itemType]',
  templateUrl: './drag-and-drop-tree.component.html',
  styleUrls: ['./drag-and-drop-tree.component.scss'],
})
export class DragAndDropTreeComponent<T> implements OnInit {
  public readonly treeControl = new NestedTreeControl<EntityTreeNode<T>>((node) => node.children);
  public readonly dataSource = new MatTreeNestedDataSource<EntityTreeNode<T>>();
  public toggleStatusText = 'status';

  @Input() public showStatus = false;
  @Input() public hideStatusButton = false;
  @Input() public itemType!: RegistrationEntityTypes;
  @Input() public currentNodeUuid?: string;
  @Input() public originalList: T[] = [];
  @Input() public nodes!: EntityTreeNode<T>[];
  @Input() public disableDrag = true;

  @Output() public readonly nodeMoved = new EventEmitter<EntityTreeNodeMoveResult>();
  @Output() public readonly nodeExpandClick = new EventEmitter<EntityTreeNode<T>>();

  // ids for connected drop lists
  dropTargetIds: string[] = [];
  nodeLookup: { [key: string]: EntityTreeNode<T> } = {};
  dropActionTodo: DropInfo | null = null;

  public readonly hasChild = (_: number, node: EntityTreeNode<T>) => node.children?.length > 0;

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {
    this.prepareDragDrop(this.nodes);

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

  prepareDragDrop(nodes: EntityTreeNode<T>[]) {
    nodes.forEach((node) => {
      this.dropTargetIds.push(node.uuid);
      this.nodeLookup[node.uuid] = node;
      this.prepareDragDrop(node.children);
    });
  }

  dragMoved(event: any) {
    let e = this.document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y);

    if (!e) {
      this.clearDragInfo();
      return;
    }
    let container = e.classList.contains('node-item') ? e : e.closest('.node-item');
    if (!container) {
      this.clearDragInfo();
      return;
    }
    this.dropActionTodo = {
      targetId: container.getAttribute('data-id') ?? '',
    };
    const targetRect = container.getBoundingClientRect();
    const oneThird = targetRect.height / 3;

    if (event.pointerPosition.y - targetRect.top < oneThird) {
      // before
      this.dropActionTodo['action'] = 'before';
    } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
      // after
      this.dropActionTodo['action'] = 'after';
    } else {
      // inside
      this.dropActionTodo['action'] = 'inside';
    }
    this.showDragInfo();
  }

  drop(event: any) {
    if (!this.dropActionTodo) return;

    const draggedItemUuid = event.item.data;
    const parentItemUuid = event.previousContainer.id;
    const targetListUuid = this.getParentNodeId(this.dropActionTodo.targetId, this.nodes, 'main');

    const draggedItem = this.nodeLookup[draggedItemUuid];

    const oldItemContainer = parentItemUuid != 'main' ? this.nodeLookup[parentItemUuid].children : this.nodes;
    const newContainer =
      targetListUuid != 'main' && targetListUuid !== null ? this.nodeLookup[targetListUuid].children : this.nodes;

    let i = oldItemContainer.findIndex((c) => c.uuid === draggedItemUuid);
    oldItemContainer.splice(i, 1);

    switch (this.dropActionTodo.action) {
      case 'before':
      case 'after':
        const targetIndex = newContainer.findIndex((c) => c.uuid === this.dropActionTodo?.targetId);
        if (this.dropActionTodo.action == 'before') {
          newContainer.splice(targetIndex, 0, draggedItem);
        } else {
          newContainer.splice(targetIndex + 1, 0, draggedItem);
        }
        this.nodeMoved.emit({ movedNodeUuid: draggedItemUuid, targetParentNodeUuid: targetListUuid! });
        break;

      case 'inside':
        this.nodeLookup[this.dropActionTodo.targetId].children.push(draggedItem);
        this.nodeLookup[this.dropActionTodo.targetId].isExpanded = true;
        this.nodeMoved.emit({ movedNodeUuid: draggedItemUuid, targetParentNodeUuid: this.dropActionTodo.targetId });
        break;
    }

    this.clearDragInfo(true);
  }

  public expandClick(node: EntityTreeNode<T>) {
    this.nodeExpandClick.emit(node);
    //node.isExpanded = !node.isExpanded;
  }

  getParentNodeId(id: string, nodesToSearch: EntityTreeNode<T>[], parentId: string): string | null {
    for (let node of nodesToSearch) {
      if (node.uuid == id) return parentId;
      let ret = this.getParentNodeId(id, node.children, node.uuid);
      if (ret) return ret;
    }
    return null;
  }

  showDragInfo() {
    this.clearDragInfo();
    if (this.dropActionTodo) {
      this.document
        .getElementById('node-' + this.dropActionTodo.targetId)
        ?.classList.add('drop-' + this.dropActionTodo.action);
    }
  }

  clearDragInfo(dropped = false) {
    if (dropped) {
      this.dropActionTodo = null;
    }
    this.document.querySelectorAll('.drop-before').forEach((element) => element.classList.remove('drop-before'));
    this.document.querySelectorAll('.drop-after').forEach((element) => element.classList.remove('drop-after'));
    this.document.querySelectorAll('.drop-inside').forEach((element) => element.classList.remove('drop-inside'));
  }
}
