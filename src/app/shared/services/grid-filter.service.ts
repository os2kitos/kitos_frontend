import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { StatePersistingService } from './state-persisting.service';
import { RegistrationEntityTypes } from '../models/registrations/registration-entity-categories.model';
import { getApplyFilterAction, getSaveFilterAction } from '../helpers/grid-filter.helpers';
import { SavedFilterState } from '../models/grid/saved-filter-state.model';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class GridFilterService {
  constructor(
    private store: Store,
    private localStorage: StatePersistingService,
    private notificationService: NotificationService
  ) {}

  public deleteFilterFromLocalStorage(entityType: RegistrationEntityTypes) {
    this.localStorage.remove(this.getLocalStorageFilterKey(entityType));
    this.notificationService.showDefault($localize`Filtre og sortering slettet`);
  }

  public columnsExistInLocalStorage(entityType: RegistrationEntityTypes) {
    return !!this.getColumnsFromLocalStorage(entityType);
  }

  public dispatchSaveFilterAction(entityType: RegistrationEntityTypes) {
    const storeKey = this.getLocalStorageFilterKey(entityType);
    const saveAction = getSaveFilterAction(entityType);
    this.store.dispatch(saveAction(storeKey));
    this.notificationService.showDefault($localize`Filtre og sortering gemt`);
  }

  public dispatchApplyFilterAction(entityType: RegistrationEntityTypes) {
    const savedState = this.getColumnsFromLocalStorage(entityType);
    if (!savedState) return;
    const applyAction = getApplyFilterAction(entityType);
    this.store.dispatch(applyAction(savedState));
    this.notificationService.showDefault($localize`Anvender gemte filtre og sortering`);
  }

  private getColumnsFromLocalStorage(entityType: RegistrationEntityTypes) {
    return this.localStorage.get<SavedFilterState>(this.getLocalStorageFilterKey(entityType));
  }

  private getLocalStorageFilterKey(entityType: RegistrationEntityTypes) {
    return entityType + '-saved-filter';
  }
}
