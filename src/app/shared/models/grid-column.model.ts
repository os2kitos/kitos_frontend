export interface GridColumn {
  field: string;
  title: string;
  section: string;
  filter?: 'text' | 'numeric' | 'boolean' | 'date';
  style?: 'default' | 'primary' | 'chip' | 'reverse-chip';
  width?: number;
  hidden: boolean;
  required?: boolean;
}
