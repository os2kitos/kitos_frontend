import { RegistrationEntityTypes } from './registrations/registration-entity-categories.model';

export interface GridColumn {
  field: string; //The field from the API
  title: string; //UI title
  section: string; //Root section for the field to be displayed in, in the Column hiding/showing dialog
  filter?: 'text' | 'numeric' | 'boolean' | 'date'; //Base kendo filter type
  extraFilter?: 'enum' | 'organization-unit' | 'choice-type' | 'dropdown-from-column-data' | 'choice-type-by-name'; //Filters other than the base kendo filters
  noFilter?: boolean; //If true hides the filter for the column
  sortFilter?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraData?: any; //Data for dropdown filters
  idField?: string; //Uuid field if needed to display data (e.g. for references to other entities)
  permissionsField?: string; //Field containing permissions for the column
  dataField?: string; //Field containing data for the column (in case the 'field' property is necessary only for filtering)
  entityType?: RegistrationEntityTypes;
  style?:
    | 'default'
    | 'primary'
    | 'chip'
    | 'reverse-chip'
    | 'enum'
    | 'link'
    | 'page-link'
    | 'title-link'
    | 'checkbox'
    | 'date'
    | 'usages'
    | 'page-link-array'
    | 'uuid-to-name'
    | 'excel-only'; //Style of the column
  width?: number;
  //If the column is hidden by default
  hidden: boolean;
  //Can column be hidden
  required?: boolean;
  // Field name from the old UI. Used for saving organizational column configuration
  persistId?: string;
}
