import { Injectable } from '@angular/core';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';
import { OrganizationUser, Right } from '../models/organization/organization-user/organization-user.model';

@Injectable()
export class RoleSelectionService {
  private selectedItems: Map<RegistrationEntityTypes, Set<Right>> = new Map();

  constructor() {
    this.selectedItems.set('organization-unit', new Set());
    this.selectedItems.set('it-system', new Set());
    this.selectedItems.set('it-contract', new Set());
    this.selectedItems.set('data-processing-registration', new Set());
  }

  selectItem(entityType: RegistrationEntityTypes, right: Right): void {
    this.selectedItems.get(entityType)?.add(right);
  }

  deselectItem(entityType: RegistrationEntityTypes, right: Right): void {
    this.selectedItems.get(entityType)?.delete(right);
  }

  isItemSelected(entityType: RegistrationEntityTypes, right: Right): boolean {
    return this.selectedItems.get(entityType)?.has(right) ?? false;
  }

  selectAllOfType(entityType: RegistrationEntityTypes, rights: Right[]): void {
    this.selectedItems.set(entityType, new Set(rights));
  }

  deselectAllOfType(entityType: RegistrationEntityTypes): void {
    this.selectedItems.set(entityType, new Set());
  }

  deselectAll(): void {
    this.selectedItems.forEach((_, entityType) => this.deselectAllOfType(entityType));
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

  selectAll(user: OrganizationUser): void {
    this.selectAllOfType('organization-unit', user.OrganizationUnitRights);
    this.selectAllOfType('it-system', user.ItSystemRights);
    this.selectAllOfType('it-contract', user.ItContractRights);
    this.selectAllOfType('data-processing-registration', user.DataProcessingRegistrationRights);
  }

  isAllSelected(user: OrganizationUser): boolean {
    return (
      this.isAllOfTypeSelected('organization-unit', user.OrganizationUnitRights) &&
      this.isAllOfTypeSelected('it-system', user.ItSystemRights) &&
      this.isAllOfTypeSelected('it-contract', user.ItContractRights) &&
      this.isAllOfTypeSelected('data-processing-registration', user.DataProcessingRegistrationRights)
    );
  }
}
