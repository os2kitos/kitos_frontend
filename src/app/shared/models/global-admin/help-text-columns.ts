import { GridActionColumn } from '../grid-action-column.model';
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
  {
    field: 'Actions',
    title: ' ',
    hidden: false,
    style: 'action-buttons',
    noFilter: true,
    isSticky: true,
    width: 50,

    extraData: [{ type: 'edit' }, { type: 'delete' }] as GridActionColumn[],
  },
];
