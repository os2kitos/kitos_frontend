import { State, toODataString as kendoToOdataString } from '@progress/kendo-data-query';

export type GridState = State;

export const defaultGridState: GridState = {
  skip: 0,
  take: 20,
};

export const toODataString = kendoToOdataString;
