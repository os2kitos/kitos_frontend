import { Injectable } from '@angular/core';
import { GridColumn } from '../models/grid-column.model';
import { LocalStorageService } from './state-persisting.service';

@Injectable({
  providedIn: 'root',
})
export class GridColumnStorageService {
  constructor(private localStorage: LocalStorageService) {}

  public setColumns(key: string, columns: GridColumn[]): void {
    const hash = this.computeHash(columns);
    this.localStorage.set<GridColumnCache>(key, { columns, hash });
  }

  public getColumns(key: string, defaultColumns: GridColumn[]): GridColumn[] | null {
    const existingCache = this.localStorage.get<GridColumnCache>(key);
    const cachedColumns = existingCache?.columns;
    if (!cachedColumns) return null;
    const newHash = this.computeHash(defaultColumns);
    if (existingCache.hash !== newHash) return null;
    return cachedColumns;
  }

  private computeHash(columns: GridColumn[]): string {
    const hashableColumns = columns.map(this.toHashableGridColumn).sort((a, b) => a.field.localeCompare(b.field));
    return this.hashMappedColumns(hashableColumns);
  }

  public columnsAreEqual(columns1: GridColumn[], columns2: GridColumn[]): boolean {
    if (columns1.length !== columns2.length) return false;
    const hash1 = this.computeHash(columns1);
    const hash2 = this.computeHash(columns2);
    return hash1 === hash2;
  }

  private hashMappedColumns(columns: GridColumn[]): string {
    const json = JSON.stringify(columns);
    let hash = 0;
    for (let i = 0; i < json.length; i++) {
      const char = json.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return hash.toString();
  }

  // Marks the fields that are not relevant for hashing, to a constant, as to not effect the hash.
  // Needs to be extended if more fields are added to the GridColumn, which shouldn't be hashed
  private toHashableGridColumn(column: GridColumn): GridColumn {
    return { ...column, width: undefined, hidden: false, disabledByUIConfig: undefined };
  }
}

type GridColumnCache = {
  columns: GridColumn[];
  hash: string;
};
