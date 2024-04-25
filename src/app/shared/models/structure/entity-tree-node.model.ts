export interface EntityTreeNode<T> {
  uuid: string;
  isRoot?: boolean;
  name: string;
  status: boolean;
  children: Array<EntityTreeNode<T>>;
  sourceData?: T;
}

export interface HierachyNodeWithParentUuid extends EntityTreeNode<never> {
  parentUuid: string | undefined;
}
