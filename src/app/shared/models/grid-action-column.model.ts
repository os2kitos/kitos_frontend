export interface GridActionColumn<T> {
  type: 'edit' | 'delete';
  onClick: (user: T) => void;
}
