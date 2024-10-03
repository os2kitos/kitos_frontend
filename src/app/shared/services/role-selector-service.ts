import { Injectable } from '@angular/core';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';
import { Right } from '../models/organization/organization-user/organization-user.model';

@Injectable()
export class RoleSelectionService {
  private selectedItems: Map<RegistrationEntityTypes, Set<Right>> = new Map();

  constructor() {
    this.selectedItems.set('organization-unit', new Set());
    this.selectedItems.set('it-system', new Set());
    this.selectedItems.set('it-contract', new Set());
    this.selectedItems.set('data-processing-registration', new Set());
  }

  selectItem(entityType: RegistrationEntityTypes, right: Right) {
    this.selectedItems.get(entityType)?.add(right);
  }

  deselectItem(entityType: RegistrationEntityTypes, right: Right) {
    this.selectedItems.get(entityType)?.delete(right);
  }

  isItemSelected(entityType: RegistrationEntityTypes, right: Right): boolean {
    return this.selectedItems.get(entityType)?.has(right) ?? false;
  }

  selectAllOfType(entityType: RegistrationEntityTypes, rights: Right[]) {
    this.selectedItems.set(entityType, new Set(rights));
  }

  deselectAllOfType(entityType: RegistrationEntityTypes) {
    this.selectedItems.set(entityType, new Set());
  }

  isAllOfTypeSelected(entityType: RegistrationEntityTypes, rights: Right[]): boolean {
    return rights.every((right) => this.isItemSelected(entityType, right));
  }

  getSelectedItemsOfType(entityType: RegistrationEntityTypes): Right[] {
    return Array.from(this.selectedItems.get(entityType)?.values() ?? []);
  }

  getSelectedItems(): Right[] {
    const sets = Array.from(this.selectedItems.values());
    return sets.flatMap((set) => Array.from(set));
  }
}
