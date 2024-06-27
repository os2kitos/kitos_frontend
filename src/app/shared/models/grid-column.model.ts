import { RegistrationEntityTypes } from './registrations/registration-entity-categories.model';

export interface GridColumn {
  //The field from the API
  field: string;
  //UI title
  title: string;
  //Root section for the field to be displayed in, in the Column hiding/showing dialog
  section: string;
  //Base kendo filter type
  filter?: 'text' | 'numeric' | 'boolean' | 'date';
  //Filters other than the base kendo filters
  extraFilter?: 'enum';
  //If true hides the filter for the column
  noFilter?: boolean;
  //Data for dropdown filters
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterData?: any;
  //Uuid field if needed to display data (e.g. for references to other entities)
  idField?: string;
  entityType?: RegistrationEntityTypes;
  //Style of the column
  style?: 'default' | 'primary' | 'chip' | 'reverse-chip' | 'enum' | 'link' | 'page-link' | 'title-link';
  width?: number;
  //If the column is hidden by default
  hidden: boolean;
  //Can column be hidden
  required?: boolean;
}
