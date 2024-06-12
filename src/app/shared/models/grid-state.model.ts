import { State, toODataString as kendoToOdataString } from '@progress/kendo-data-query';
import { ODataSettings } from '@progress/kendo-data-query/dist/npm/odata.operators';

export interface GridState extends State {
  all?: boolean;
}

export const defaultGridState: GridState = {
  skip: 0,
  take: 100,
};

export const toODataString = (gridState: GridState, settings?: ODataSettings) => {
  // Remove take/top from created odata string if page size of 'all' is chosen
  return kendoToOdataString({ ...gridState, take: gridState.all === true ? undefined : gridState.take }, settings);
};
/* export const toODataString = (gridState: GridState) => {
  const oData: string[] = [];
  if (gridState.skip) {
    oData.push(`$skip=${gridState.skip}`);
  }
  if (gridState.take && gridState.take !== 'all') {
    oData.push(`$top=${gridState.take}`);
  }
  return `${oData.join('&')}&$count=true`;
}; */
