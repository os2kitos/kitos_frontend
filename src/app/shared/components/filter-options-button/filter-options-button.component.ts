import { Component, Input } from '@angular/core';
import { StatePersistingService } from '../../services/state-persisting.service';
import { NotificationService } from '../../services/notification.service';
import { PopupMessageType } from '../../enums/popup-message-type';
import { Store } from '@ngrx/store';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';

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

  private getLocalStorageFilterKey() {
    return this.entityType + '-saved-filter';
  }

  private dispatchSaveFilterAction() {
    switch (this.entityType) {
      case 'it-system-usage':
        console.log("Dispatching saveITSystemFilter action");
        this.store.dispatch(ITSystemUsageActions.saveITSystemFilter(this.getLocalStorageFilterKey()));
        break;
      default:
        throw "Unkown entityType: " + this.entityType;
    }
  }

  private dispatchApplyFilterAction() {
    switch (this.entityType) {
      case 'it-system-usage':
        console.log("Dispatching applyITSystemFilter action");
        this.store.dispatch(ITSystemUsageActions.applyITSystemFilter(this.getLocalStorageFilterKey()));
        break;
      default:
        throw "Unkown entityType: " + this.entityType;
    }
  }
}
