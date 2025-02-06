import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { getDetailsPageLink } from '../../helpers/link.helpers';
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
  public toggleStatusText = 'status';

  @Input() public itemType!: RegistrationEntityTypes;
  @Input() public currentNodeUuid?: string;
  @Input() public nodes!: EntityTreeNode<T>[];
  @Input() public disableDrag = true;
  @Input() public maxLevel?: number = undefined;
  @Input() public disableRedirect = false;
  @Input() public checkboxNodes = false;
  @Input() public disableCheck = false;
  @Input() public displayDefaultNodeColorOnly = false;

  @Output() public readonly nodeMoved = new EventEmitter<EntityTreeNodeMoveResult>();
  @Output() public readonly nodeExpandClick = new EventEmitter<EntityTreeNode<T>>();

  @Output() public readonly nodeChecked = new EventEmitter<EntityTreeNode<T>>();

  // ids for connected drop lists
  dropTargetIds: string[] = [];
  nodeLookup: { [key: string]: EntityTreeNode<T> } = {};
  dropActionTodo: DropInfo | null = null;

  private readonly nodeStandardColor = 'standard';

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router) {}

  ngOnInit(): void {
    this.prepareDragDrop(this.nodes);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public dragMoved(event: any) {
    const e = this.document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y);

    if (!e) {
      this.clearDragInfo();
      return;
    }
    const container = e.classList.contains('node-item') ? e : e.closest('.node-item');
    if (!container) {
      this.clearDragInfo();
      return;
    }
    this.dropActionTodo = {
      targetId: container.getAttribute('data-id') ?? '',
    };
    const targetListUuid = this.getParentNodeId(this.dropActionTodo.targetId, this.nodes, 'main');
    const targetRect = container.getBoundingClientRect();
    const oneThird = targetRect.height / 3;

    // before
    if (event.pointerPosition.y - targetRect.top < oneThird) {
      //if target uuid is main, it should be placed after the node
      if (targetListUuid === 'main') {
        this.dropActionTodo['action'] = 'inside';
      } else {
        this.dropActionTodo['action'] = 'before';
      }
    }
    // after
    else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
      this.dropActionTodo['action'] = 'after';
    }
    // inside
    else {
      this.dropActionTodo['action'] = 'inside';
    }
    this.showDragInfo();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public drop(event: any) {
    if (!this.dropActionTodo) return;

    const draggedItemUuid = event.item.data;
    let targetListUuid = this.getParentNodeId(this.dropActionTodo.targetId, this.nodes, 'main');

    if (targetListUuid === 'main') {
      if (this.dropActionTodo.action === 'before') return;

      targetListUuid = this.dropActionTodo.targetId;
    }

    const draggedItem = this.nodeLookup[draggedItemUuid];

    const newContainer = targetListUuid !== null ? this.nodeLookup[targetListUuid].children : this.nodes;

    switch (this.dropActionTodo.action) {
      case 'before':
      case 'after':
        this.insertDraggedItem(newContainer, draggedItem, this.dropActionTodo.targetId, this.dropActionTodo.action);
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
  }

  public checkNode(node: EntityTreeNode<T>) {
    if (this.disableCheck) return;

    this.nodeChecked.emit(node);
  }

  public checkNodeTextClick(node: EntityTreeNode<T>) {
    if (this.disableCheck) return;

    node.status = !node.status;
    this.checkNode(node);
  }

  public getNodeColor(node: EntityTreeNode<T>) {
    return this.displayDefaultNodeColorOnly ? this.nodeStandardColor : node.color;
  }

  public goToNode(node: EntityTreeNode<T>) {
    const path = getDetailsPageLink(node.uuid, this.itemType);
    if (path) {
      this.router.navigate([path]);
    }
  }

  private getParentNodeId(id: string, nodesToSearch: EntityTreeNode<T>[], parentId: string): string | null {
    for (const node of nodesToSearch) {
      if (node.uuid == id) return parentId;
      const ret = this.getParentNodeId(id, node.children, node.uuid);
      if (ret) return ret;
    }
    return null;
  }

  private showDragInfo() {
    this.clearDragInfo();
    if (this.dropActionTodo) {
      this.document
        .getElementById('node-' + this.dropActionTodo.targetId)
        ?.classList.add('drop-' + this.dropActionTodo.action);
    }
  }

  private clearDragInfo(dropped = false) {
    if (dropped) {
      this.dropActionTodo = null;
    }
    this.document.querySelectorAll('.drop-before').forEach((element) => element.classList.remove('drop-before'));
    this.document.querySelectorAll('.drop-after').forEach((element) => element.classList.remove('drop-after'));
    this.document.querySelectorAll('.drop-inside').forEach((element) => element.classList.remove('drop-inside'));
  }

  private prepareDragDrop(nodes: EntityTreeNode<T>[]) {
    nodes.forEach((node) => {
      this.dropTargetIds.push(node.uuid);
      this.nodeLookup[node.uuid] = node;
      this.prepareDragDrop(node.children);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private insertDraggedItem(newContainer: any[], draggedItem: any, targetId: string, action: string): void {
    const targetIndex = newContainer.findIndex((c) => c.uuid === targetId);
    if (action === 'before') {
      newContainer.splice(targetIndex, 0, draggedItem);
    } else {
      newContainer.splice(targetIndex + 1, 0, draggedItem);
    }
  }
}
