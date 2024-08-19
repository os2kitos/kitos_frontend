import { Component, Input } from '@angular/core';
import { StatePersistingService } from '../../services/state-persisting.service';
import { NotificationService } from '../../services/notification.service';
import { PopupMessageType } from '../../enums/popup-message-type';
import { Store } from '@ngrx/store';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import { GridColumn } from '../../models/grid-column.model';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-filter-options-button',
  templateUrl: './filter-options-button.component.html',
  styleUrl: './filter-options-button.component.scss',
})
export class FilterOptionsButtonComponent {
  @Input() entityType!: RegistrationEntityTypes;

  constructor(
    private store: Store,
    private localStorage: StatePersistingService,
    private notificationService: NotificationService
  ) {}

  onSaveClick() {
    this.dispatchSaveFilterAction();
    this.notificationService.show($localize`Filtre og sortering gemt`, PopupMessageType.default);
  }

  onApplyClck() {
    this.dispatchApplyFilterAction();
    this.notificationService.show($localize`Anvender gemte filtre og sortering`, PopupMessageType.default);
  }

  onDeleteClick() {
    this.deleteFilterFromLocalStorage();
    this.notificationService.show($localize`Filtre og sortering slettet`, PopupMessageType.default);
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
    switch (this.entityType) {
      case 'it-system-usage':
        this.store.dispatch(ITSystemUsageActions.saveITSystemUsageFilter(this.getLocalStorageFilterKey()));
        break;
      case 'it-system':
        this.store.dispatch(ITSystemActions.saveITSystemFilter(this.getLocalStorageFilterKey()));
        break;
      case 'it-interface':
        this.store.dispatch(ITInterfaceActions.saveITInterfacesFilter(this.getLocalStorageFilterKey()));
        break;
      default:
        throw "Filter options not implemented for " + this.entityType;
    }
  }

  private dispatchApplyFilterAction() {
    const savedState = this.getColumnsFromLocalStorage();
    switch (this.entityType) {
      case 'it-system-usage':
        this.store.dispatch(ITSystemUsageActions.applyITSystemUsageFilter(savedState));
        break;
      case 'it-system':
        this.store.dispatch(ITSystemActions.applyITSystemFilter(savedState));
        break;
      case 'it-interface':
        this.store.dispatch(ITInterfaceActions.applyITInterfacesFilter(savedState));
        break;
      default:
        throw "Filter options not implemented for " + this.entityType;
    }
  }
}

export type SavedFilterState = {
  columns: GridColumn[];
  sort: SortDescriptor[];
}
