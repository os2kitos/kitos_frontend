export interface GridColumn {
  field: string;
  title: string;
  filter?: 'text' | 'numeric' | 'boolean' | 'date';
  style?: 'default' | 'primary' | 'chip';
}
