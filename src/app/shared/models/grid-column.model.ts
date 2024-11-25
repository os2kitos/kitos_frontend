import { BooleanValueDisplayType } from '../components/status-chip/status-chip.component';
import { RegistrationEntityTypes } from './registrations/registration-entity-categories.model';

export interface GridColumn {
  /*********************/
  //Required properties
  /*********************/
  field: string; //The field from the API
  title: string; //UI title
  hidden: boolean; //If the column is hidden by default

  /*********************/
  //Optional properties
  /*********************/
  section?: string; //Root section for the field to be displayed in, in the Column hiding/showing dialog
  filter?: 'text' | 'numeric' | 'boolean' | 'date'; //Base kendo filter type
  extraFilter?: 'enum' | 'organization-unit' | 'choice-type' | 'dropdown-from-column-data' | 'choice-type-by-name'; //Filters other than the base kendo filters
  noFilter?: boolean; //If true hides the filter for the column
  sortable?: boolean; //If true allows sorting for the column
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
    | 'boolean'
    | 'enum'
    | 'link'
    | 'page-link'
    | 'title-link'
    | 'checkbox'
    | 'date'
    | 'usages'
    | 'page-link-array'
    | 'uuid-to-name'
    | 'excel-only'
    | 'action-buttons'
    | 'priority-buttons'
    ; //Style of the column
  width?: number;
  minResizableWidth?: number;
  //Can column be hidden
  required?: boolean;
  // Field name from the old UI. Used for saving organizational column configuration
  persistId?: string;
  tooltipPositiveText?: string;
  tooltipNegativeText?: string;
  isSticky?: boolean;
  booleanValueDisplay?: BooleanValueDisplayType; // Defines how boolean values should be displayed. If not set, RegistrationEntityTypes will be used to derive the display type
  disabledByUIConfig?: boolean;
}

