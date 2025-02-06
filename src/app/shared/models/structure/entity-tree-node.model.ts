import { EntityTreeNodeColors } from './entity-tree-node-colors.model';

export interface EntityTreeNode<T> {
  uuid: string;
  isRoot?: boolean;
  name: string;
  status?: boolean;
  children: Array<EntityTreeNode<T>>;
  sourceData?: T;
  color?: EntityTreeNodeColors;
  isExpanded?: boolean;
}

export interface HierachyNodeWithParentUuid extends EntityTreeNode<never> {
  parentUuid: string | undefined;
}

export interface EntityTreeNodeMoveResult {
  movedNodeUuid: string;
  targetParentNodeUuid: string;
}
