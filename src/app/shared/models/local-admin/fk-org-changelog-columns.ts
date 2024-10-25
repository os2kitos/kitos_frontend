import { GridColumn } from '../grid-column.model';
import { fkOrgConnectionChangeTypeChoiceOptions } from './connection-change-type.model';

export const fkOrgChangelogGridColumns: GridColumn[] = [
  {
    field: 'name',
    title: $localize`Organisationsenhed`,
    hidden: false,
  },
  {
    field: 'category',
    title: $localize`Ændring`,
    hidden: false,
    extraFilter: 'enum',
    extraData: fkOrgConnectionChangeTypeChoiceOptions,
  },
  {
    field: 'description',
    title: $localize`Beskrivelse`,
    hidden: false,
  },
];
