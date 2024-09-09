import { Component, Input, OnInit } from '@angular/core';
import { StatePersistingService } from '../../services/state-persisting.service';
import { NotificationService } from '../../services/notification.service';
import { Store } from '@ngrx/store';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { SavedFilterState } from '../../models/grid/saved-filter-state.model';
import { getApplyFilterAction, getSaveFilterAction } from '../../helpers/grid-filter.helpers';

@Component({
  selector: 'app-filter-options-button',
  templateUrl: './filter-options-button.component.html',
  styleUrl: './filter-options-button.component.scss',
})
export class FilterOptionsButtonComponent implements OnInit {
  @Input() entityType!: RegistrationEntityTypes;

  public disabled: boolean = false;

  constructor(
    private store: Store,
    private localStorage: StatePersistingService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.disabled = !this.getColumnsFromLocalStorage();
  }

  onSaveClick() {
    this.disabled = false;
    this.dispatchSaveFilterAction();
    this.notificationService.showDefault($localize`Filtre og sortering gemt`);
  }

  onApplyClck() {
    if (this.disabled) return;
    this.dispatchApplyFilterAction();
    this.notificationService.showDefault($localize`Anvender gemte filtre og sortering`);
  }

  onDeleteClick() {
    if (this.disabled) return;
    this.disabled = true;
    this.deleteFilterFromLocalStorage();
    this.notificationService.showDefault($localize`Filtre og sortering slettet`);
  }

  private deleteFilterFromLocalStorage() {
    this.localStorage.remove(this.getLocalStorageFilterKey());
  }

  private getColumnsFromLocalStorage() {
    return this.localStorage.get<SavedFilterState>(this.getLocalStorageFilterKey());
  }

  private getLocalStorageFilterKey() {
    return this.entityType + '-saved-filter';
  }

  private dispatchSaveFilterAction() {
    const storeKey = this.getLocalStorageFilterKey();
    const saveAction = getSaveFilterAction(this.entityType);
    this.store.dispatch(saveAction(storeKey));
  }

  private dispatchApplyFilterAction() {
    const savedState = this.getColumnsFromLocalStorage();
    if (!savedState) return;
    const applyAction = getApplyFilterAction(this.entityType);
    this.store.dispatch(applyAction(savedState));
  }
}
