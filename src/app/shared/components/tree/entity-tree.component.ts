import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import {
  MatTreeNestedDataSource,
  MatTree,
  MatTreeNodeDef,
  MatTreeNode,
  MatNestedTreeNode,
  MatTreeNodeToggle,
  MatTreeNodeOutlet,
} from '@angular/material/tree';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { EntityTreeNode } from '../../models/structure/entity-tree-node.model';
import { BooleanValueDisplayType, StatusChipComponent } from '../status-chip/status-chip.component';
import { NgClass } from '@angular/common';
import { DetailsPageLinkComponent } from '../details-page-link/details-page-link.component';
import { MatIconButton } from '@angular/material/button';
import { ChevronDownIconComponent } from '../icons/chevron-down-icon.component';
import { ChevronRightIconComponent } from '../icons/chevron-right-icon.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';

@Component({
  selector: 'app-entity-tree[nodes][itemType]',
  templateUrl: './entity-tree.component.html',
  styleUrls: ['./entity-tree.component.scss'],
  imports: [
    MatTree,
    MatTreeNodeDef,
    MatTreeNode,
    NgClass,
    DetailsPageLinkComponent,
    StatusChipComponent,
    MatNestedTreeNode,
    MatIconButton,
    MatTreeNodeToggle,
    ChevronDownIconComponent,
    ChevronRightIconComponent,
    MatTreeNodeOutlet,
    CheckboxComponent
],
})
export class EntityTreeComponent<T> implements OnInit {
  public readonly treeControl = new NestedTreeControl<EntityTreeNode<T>>((node) => node.children);
  public readonly dataSource = new MatTreeNestedDataSource<EntityTreeNode<T>>();
  public toggleStatusText = 'status';
  public toggleExtraStatusText = 'extra-status';
  public showExtraStatusValue = false;

  @Input() public showStatus = false;
  @Input() public hideStatusButton = false;
  @Input() public showExtraStatus = false;
  @Input() public itemType!: RegistrationEntityTypes;
  @Input() public currentNodeUuid?: string;
  @Input() public set nodes(nodes: EntityTreeNode<T>[]) {
    this.dataSource.data = nodes;
    this.treeControl.dataNodes = nodes;
    this.treeControl.expandAll();
  }
  @Input() public extraStatusDisplayType?: BooleanValueDisplayType;

  public readonly hasChild = (_: number, node: EntityTreeNode<T>) => node.children?.length > 0;

  ngOnInit(): void {
    switch (this.itemType) {
      case 'organization':
      case 'it-system-usage':
      case 'it-system':
        this.toggleStatusText = $localize`Vis tilgængelighed`;
        this.toggleExtraStatusText = $localize`Vis anvendelse`;
        break;
      case 'it-contract':
        this.toggleStatusText = $localize`Vis gyldighed`;
        this.toggleExtraStatusText = $localize`Nedarver kontrakten sin overordnedes gyldighed`;
        break;
      default:
        throw 'Unsupported item type:' + this.itemType;
    }
  }
}
