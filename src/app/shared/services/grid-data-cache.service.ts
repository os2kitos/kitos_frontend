import { Injectable } from '@angular/core';
import { ODataSettings } from '@progress/kendo-data-query/dist/npm/odata.operators';
import { GRID_DATA_CACHE_CHUNK_SIZE } from '../constants/constants';
import { GridDataCache, GridDataCacheChunk, GridDataCacheRange } from '../models/grid-data.model';
import { GridState, toODataString } from '../models/grid-state.model';
import { isEqual } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class GridDataCacheService {
  private emptyCacheRange = {
    data: undefined,
    total: 0,
  };
  private chunkSize = GRID_DATA_CACHE_CHUNK_SIZE;
  private cache: GridDataCache = {
    chunks: [],
    total: 0,
  };

  constructor() {}

  public get(gridState: GridState): GridDataCacheRange {
    const cacheChunks = this.cache.chunks;
    if (cacheChunks.length === 0) return this.emptyCacheRange;

    const cacheStartIndex = this.getCacheStartIndex(gridState);
    const chunkCount = this.getChunkCount(gridState);

    const relevantChunks = cacheChunks
      .slice(cacheStartIndex, cacheStartIndex + chunkCount)
      .filter((chunk) => chunk !== undefined);

    if (relevantChunks.length !== chunkCount) return this.emptyCacheRange;

    return {
      data: this.gridStateSliceFromChunks(relevantChunks, gridState),
      total: this.cache.total,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public set(gridState: GridState, data: any[], total: number) {
    let cacheIndex = this.getCacheStartIndex(gridState);
    const passesToDo = Math.ceil(data.length / this.chunkSize);

    for (let i = 0; i < passesToDo; i++) {
      this.cache.chunks[cacheIndex++] = {
        data: data.slice(i * this.chunkSize, (i + 1) * this.chunkSize),
      };
    }
    this.cache.total = total;
  }

  public tryResetOnGridStateChange(currState: GridState, prevState: GridState) {
    if (this.shouldResetOnGridStateChange(currState, prevState)) {
      this.reset();
    }
  }

  public reset() {
    this.cache = {
      chunks: [],
      total: 0,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public gridStateSliceFromArray(data: any[], gridState: GridState) {
    const chunkSkip = this.getChunkedSkip(gridState.skip);
    const startSlice = (gridState.skip ?? 0) - chunkSkip;
    const endSlice = startSlice + (gridState.take ?? 0);

    return data.slice(startSlice, endSlice);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private gridStateSliceFromChunks(chunks: GridDataCacheChunk[], gridState: GridState) {
    const concatenatedData = [];
    for (const chunk of chunks) {
      if (chunk === undefined) {
        return undefined;
      }
      concatenatedData.push(...chunk.data);
    }
    return this.gridStateSliceFromArray(concatenatedData, gridState);
  }

  public getTotal() {
    return this.cache.total;
  }

  public shouldResetOnGridStateChange(newState: GridState, previousState: GridState) {
    if (newState.take !== previousState.take) {
      return true;
    }

    if (newState.all !== previousState.all) {
      return true;
    }

    if (isEqual(newState.sort, previousState.sort)) return true;

    if (!isEqual(newState.filter, previousState.filter)) {
      return true;
    }

    if (!isEqual(newState.group, previousState.group)) {
      return true;
    }

    return false;
  }

  private getChunkedSkip(skip: number | undefined) {
    return Math.floor((skip ?? 0) / this.chunkSize) * this.chunkSize;
  }

  private getChunkedTake(gridState: GridState) {
    const skip = gridState.skip ?? 0;
    const take = gridState.take ?? 0;
    const chunkSkip = this.getChunkedSkip(gridState.skip);
    return Math.ceil((skip + take) / this.chunkSize) * this.chunkSize - chunkSkip;
  }

  private getCacheStartIndex(gridState: GridState) {
    return this.getChunkedSkip(gridState.skip) / this.chunkSize;
  }

  private getChunkCount(gridState: GridState) {
    const chunkTake = this.getChunkedTake(gridState);
    return chunkTake / this.chunkSize;
  }

  public toChunkedODataString(gridState: GridState, settings?: ODataSettings) {
    const chunkSkip = this.getChunkedSkip(gridState.skip);
    const chunkTake = this.getChunkedTake(gridState);
    const cacheableGridState = {
      ...gridState,
      skip: chunkSkip,
      take: chunkTake,
    };
    return toODataString(cacheableGridState, settings);
  }
}
