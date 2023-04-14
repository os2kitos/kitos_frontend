import { PageSize } from './page-size-item.model';

export interface GridState {
  skip?: number;
  take?: PageSize;
}

export const defaultGridState: GridState = {
  skip: 0,
  take: 100,
};

export const toODataString = (gridState: GridState) => {
  const oData: string[] = [];
  if (gridState.skip) {
    oData.push(`$skip=${gridState.skip}`);
  }
  if (gridState.take && gridState.take !== 'all') {
    oData.push(`$top=${gridState.take}`);
  }
  return `${oData.join('&')}&$count=true`;
};
