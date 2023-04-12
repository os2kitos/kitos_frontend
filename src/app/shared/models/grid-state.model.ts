export interface GridState {
  skip?: number;
  take?: number;
  all?: boolean;
}

export const defaultGridState: GridState = {
  skip: 0,
  take: 100,
};

export const toODataString = (gridState: GridState) => {
  return `$skip=${gridState.skip}&$top=${gridState.take}&$count=true`;
};
