import { State, toODataString as kendoToOdataString } from '@progress/kendo-data-query';
import { ODataSettings } from '@progress/kendo-data-query/dist/npm/odata.operators';

export interface GridState extends State {
  all?: boolean;
}

export const defaultGridState: GridState = {
  skip: 0,
  take: 25,
}

export const toODataString = (gridState: GridState, settings?: ODataSettings) => {
  // Remove take/top from created odata string if page size of 'all' is chosen
  return kendoToOdataString({ ...gridState, skip: gridState.all === true ? 0 : gridState.skip, take: gridState.all === true ? undefined : gridState.take }, settings);
}
