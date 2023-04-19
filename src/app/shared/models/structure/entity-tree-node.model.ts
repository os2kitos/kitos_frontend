export interface EntityTreeNode<T> {
  uuid: string;
  name: string;
  status: boolean;
  children: Array<EntityTreeNode<T>>;
  sourceData?: T;
}
