import { createGridActionColumn } from '../grid-action-column.model';
import { GridColumn } from '../grid-column.model';

export const helpTextColumns: GridColumn[] = [
  {
    field: 'Title',
    title: $localize`Titel`,
    hidden: false,
  },
  {
    field: 'Key',
    title: $localize`Nøgle`,
    hidden: false,
  },
  createGridActionColumn(['edit', 'delete']),
];
