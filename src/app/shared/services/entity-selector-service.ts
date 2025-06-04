/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HasId } from '../models/has-id';

@Injectable()
export class EntitySelectionService<TEntity extends HasId, TTypes> {
  private selectedItems: Map<TTypes, Map<any, TEntity>> = new Map();

  initSelectedItems(entityTypes: TTypes[]): void {
    entityTypes.forEach((type) => {
      this.selectedItems.set(type, new Map());
    });
  }

  selectItem(entityType: TTypes, entity: TEntity): void {
    this.selectedItems.get(entityType)?.set(entity.id, entity);
  }

  deselectItem(entityType: TTypes, entity: TEntity): void {
    this.selectedItems.get(entityType)?.delete(entity.id);
  }

  isItemSelected(entityType: TTypes, entity: TEntity): boolean {
    return this.selectedItems.get(entityType)?.has(entity.id) ?? false;
  }

  selectAllOfType(entityType: TTypes, entities: TEntity[]): void {
    const entityMap = new Map(entities.map((entity) => [entity.id, entity]));
    this.selectedItems.set(entityType, entityMap);
  }

  deselectAllOfType(entityType: TTypes): void {
    this.selectedItems.set(entityType, new Map());
  }

  deselectAll(): void {
    this.selectedItems.forEach((_, entityType) => this.deselectAllOfType(entityType));
  }

  isAllOfTypeSelected(entityType: TTypes, entities: TEntity[]): boolean {
    return entities.every((entity) => this.isItemSelected(entityType, entity));
  }

  getSelectedItemsOfType(entityType: TTypes): TEntity[] {
    return Array.from(this.selectedItems.get(entityType)?.values() ?? []);
  }

  getSelectedItems(): TEntity[] {
    const maps = Array.from(this.selectedItems.values());
    return maps.flatMap((map) => Array.from(map.values()));
  }

  isAnySelected(): boolean {
    return this.getSelectedItems().length > 0;
  }
}
