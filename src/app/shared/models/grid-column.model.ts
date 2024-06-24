export interface GridColumn {
  field: string;
  title: string;
  section: string;
  filter?: 'text' | 'numeric' | 'boolean' | 'date';
  extraFilter?: 'enum';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterData?: any;
  style?: 'default' | 'primary' | 'chip' | 'reverse-chip' | 'enum';
  width?: number;
  hidden: boolean;
  required?: boolean;
}
