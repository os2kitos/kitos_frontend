import { GridDataResult } from '@progress/kendo-angular-grid';

export type GridData = GridDataResult;

export interface GridDataCacheRange {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[] | undefined;
  total: number;
}

export interface GridDataCache {
  chunks: (GridDataCacheChunk | undefined)[];
  total: number;
}

export interface GridDataCacheChunk {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
}
